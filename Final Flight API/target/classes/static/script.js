document.getElementById("flightForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
        from: document.getElementById("from").value,
        to: document.getElementById("to").value,
        date: document.getElementById("date").value
    };

    const url = `/api/flights/search?from=${formData.from}&to=${formData.to}&date=${formData.date}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            return response.json();
        })
        .then(flights => {
            console.log("API Response:", flights);
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "";

            if (!Array.isArray(flights) || flights.length === 0) {
                resultsDiv.innerText = "No flights found.";
                return;
            }

            flights.forEach(flight => {
                const div = document.createElement("div");
                div.className = "flight";

                div.innerHTML = `
                    <p>From ${flight.from || flight.departureCity} to ${flight.to || flight.arrivalCity}
                    on ${flight.date || flight.departureDate} - ${flight.airline || 'N/A'},
                    $${flight.price || 'N/A'}</p>
                    <button>Book This Flight</button>
                `;

                div.querySelector("button").addEventListener("click", () => {
                    const passengers = document.getElementById("people").value || "1";
                    flight.passengers = parseInt(passengers);  // Passengers attached
                    localStorage.setItem("selectedFlight", JSON.stringify(flight));
                    window.location.href = "/book.html";
                });

                resultsDiv.appendChild(div);
            });
        })
        .catch(error => {
            document.getElementById("results").innerText = "Error: " + error.message;
            console.error("Search Error:", error);
        });
});
