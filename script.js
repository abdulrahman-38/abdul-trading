document.addEventListener("DOMContentLoaded", () => {

    const coins = [
        { id: "bitcoin", symbol: "BTC" },
        { id: "ethereum", symbol: "ETH" },
        { id: "solana", symbol: "SOL" },
        { id: "binancecoin", symbol: "BNB" }
    ];

    async function fetchPrices() {
        try {
            const ids = coins.map(c => c.id).join(",");

            const url =
                `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch prices");
            }

            const data = await response.json();

            const cards = document.querySelectorAll(".coin-card");

            coins.forEach((coin, index) => {
                const card = cards[index];

                if (!card || !data[coin.id]) return;

                const price = data[coin.id].usd;
                const change = data[coin.id].usd_24h_change;

                const priceElement = card.querySelector("span");
                const changeElement = card.querySelector("small");

                priceElement.textContent =
                    "$" + Number(price).toLocaleString(undefined, {
                        maximumFractionDigits: 4
                    });

                changeElement.textContent =
                    `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

                changeElement.classList.remove("up", "down");
                changeElement.classList.add(change >= 0 ? "up" : "down");
            });

        } catch (error) {
            console.error("Price update failed:", error);
        }
    }

    fetchPrices();

    setInterval(fetchPrices, 60000);

});
