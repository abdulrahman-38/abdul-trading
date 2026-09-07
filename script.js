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
            const btcMainPrice = document.getElementById("btc-main-price");
            const btcMainChange = document.getElementById("btc-main-change");
            
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
            const btc = data["bitcoin"];

if (btcMainPrice && btcMainChange && btc) {
    const btcPrice = btc.usd;
    const btcChange = btc.usd_24h_change;

    btcMainPrice.textContent =
        "$" + Number(btcPrice).toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });

    btcMainChange.textContent =
        `${btcChange >= 0 ? "+" : ""}${btcChange.toFixed(2)}%`;

    btcMainChange.classList.remove("up", "down");
    btcMainChange.classList.add(btcChange >= 0 ? "up" : "down");
}
        } catch (error) {
            console.error("Price update failed:", error);
        }
    }

    fetchPrices();
    setInterval(fetchPrices, 60000);


    // =============================
    // BTC CANDLESTICK CHART
    // =============================

    const chartContainer = document.getElementById("btc-chart");

    const chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: 245,
        layout: {
            background: {
                type: "solid",
                color: "transparent"
            },
            textColor: "#70757c"
        },
        grid: {
            vertLines: {
                color: "rgba(255,255,255,0.035)"
            },
            horzLines: {
                color: "rgba(255,255,255,0.035)"
            }
        },
        rightPriceScale: {
            borderColor: "rgba(255,255,255,0.08)"
        },
        timeScale: {
            borderColor: "rgba(255,255,255,0.08)",
            timeVisible: true
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal
        }
    });

    const candleSeries = chart.addCandlestickSeries({
        upColor: "#00d68f",
        downColor: "#ff5364",
        borderVisible: false,
        wickUpColor: "#00d68f",
        wickDownColor: "#ff5364"
    });

    async function loadBTCChart(interval = "1h") {
    try {
        const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=120`
        );

        if (!response.ok) {
            throw new Error("Failed to load chart");
        }

        const data = await response.json();

        const candles = data.map(candle => ({
            time: candle[0] / 1000,
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4])
        }));

        candleSeries.setData(candles);
        chart.timeScale().fitContent();

    } catch (error) {
        console.error("Chart error:", error);
    }
}
    loadBTCChart();
const timeframeMap = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "1H": "1h",
    "1D": "1d"
};

document.querySelectorAll(".timeframes button").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".timeframes button")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const interval = timeframeMap[button.textContent.trim()];

        if (interval) {
            loadBTCChart(interval);
        }
    });
});
    // Responsive chart
    window.addEventListener("resize", () => {
        chart.applyOptions({
            width: chartContainer.clientWidth
        });
    });

});
