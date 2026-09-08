document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // LIVE CRYPTO CARDS
    // =========================================

    const coins = [
        { id: "bitcoin", symbol: "BTC" },
        { id: "ethereum", symbol: "ETH" },
        { id: "solana", symbol: "SOL" },
        { id: "binancecoin", symbol: "BNB" }
    ];

    async function fetchCryptoCards() {
        try {
            const ids = coins.map(coin => coin.id).join(",");

            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
            );

            if (!response.ok) return;

            const data = await response.json();
            const cards = document.querySelectorAll(".coin-card");

            coins.forEach((coin, index) => {
                const card = cards[index];
                const coinData = data[coin.id];

                if (!card || !coinData) return;

                const priceElement = card.querySelector("span");
                const changeElement = card.querySelector("small");

                const price = Number(coinData.usd);
                const change = Number(coinData.usd_24h_change || 0);

                priceElement.textContent =
                    "$" + price.toLocaleString(undefined, {
                        maximumFractionDigits: 4
                    });

                changeElement.textContent =
                    `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

                changeElement.classList.remove("up", "down");
                changeElement.classList.add(
                    change >= 0 ? "up" : "down"
                );
            });

        } catch (error) {
            console.error("Coin cards error:", error);
        }
    }


    // =========================================
    // BTC MAIN PRICE — BINANCE
    // =========================================

    async function fetchBTCMainPrice() {
        try {
            const response = await fetch(
                "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
            );

            if (!response.ok) {
                throw new Error("BTC ticker failed");
            }

            const data = await response.json();

            const priceElement =
                document.getElementById("btc-main-price");

            const changeElement =
                document.getElementById("btc-main-change");

            const price = Number(data.lastPrice);
            const change = Number(data.priceChangePercent);

            if (priceElement) {
                priceElement.textContent =
                    "$" + price.toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1
                    });
            }

            if (changeElement) {
                changeElement.textContent =
                    `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

                changeElement.classList.remove("up", "down");

                changeElement.classList.add(
                    change >= 0 ? "up" : "down"
                );
            }

        } catch (error) {
            console.error("BTC price error:", error);
        }
    }


    // =========================================
    // BTC CHART
    // =========================================

    const chartContainer =
        document.getElementById("btc-chart");

    if (!chartContainer) {
        console.error("BTC chart container not found");
        return;
    }

    const chart = LightweightCharts.createChart(
        chartContainer,
        {
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
                timeVisible: true,
                secondsVisible: false
            },

            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal
            }
        }
    );


    const candleSeries =
        chart.addCandlestickSeries({
            upColor: "#00d68f",
            downColor: "#ff5364",

            borderVisible: false,

            wickUpColor: "#00d68f",
            wickDownColor: "#ff5364"
        });


    // =========================================
    // LOAD CANDLES
    // =========================================

    async function loadBTCChart(interval = "1h") {

        try {

            const response = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=120`
            );

            if (!response.ok) {
                throw new Error("Chart request failed");
            }

            const data = await response.json();

            const candles = data.map(candle => ({
                time: Math.floor(candle[0] / 1000),
                open: Number(candle[1]),
                high: Number(candle[2]),
                low: Number(candle[3]),
                close: Number(candle[4])
            }));

            candleSeries.setData(candles);

            const lastCandle = candles[candles.length - 1];

const mainPrice = document.getElementById("btc-main-price");

if (mainPrice && lastCandle) {
    mainPrice.textContent =
        "$" + lastCandle.close.toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
}
            chart.timeScale().fitContent();

        } catch (error) {
            console.error("Chart error:", error);
        }
    }


    // =========================================
    // TIMEFRAME BUTTONS
    // =========================================

    const timeframeMap = {
        "1m": "1m",
        "5m": "5m",
        "15m": "15m",
        "1H": "1h",
        "1D": "1d"
    };


    document
        .querySelectorAll(".timeframes button")
        .forEach(button => {

            button.addEventListener("click", async () => {

                const label =
                    button.textContent.trim();

                const interval =
                    timeframeMap[label];

                if (!interval) return;

                document
                    .querySelectorAll(".timeframes button")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                await loadBTCChart(interval);
            });

        });


    // =========================================
    // INITIAL LOAD
    // =========================================

    fetchCryptoCards();
    fetchBTCMainPrice();

    loadBTCChart("1h");


    // =========================================
    // AUTO UPDATE
    // =========================================

    setInterval(fetchCryptoCards, 60000);
    setInterval(fetchBTCMainPrice, 15000);


    // =========================================
    // RESPONSIVE
    // =========================================

    window.addEventListener("resize", () => {

        chart.applyOptions({
            width: chartContainer.clientWidth
        });

    });
// =========================================
// TOP MENU NAVIGATION
// =========================================

const topMenuButtons = document.querySelectorAll(".top-menu button");

const sectionMap = {
    "Home": "top",
    "Markets": "markets",
    "News": "news",
    "Watchlist": "watchlist"
};

topMenuButtons.forEach(button => {
    button.addEventListener("click", () => {

        const label = button.querySelector("small")?.textContent.trim();

        if (!label || label === "More") return;

        topMenuButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        if (label === "Home") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;
        }

        const sectionId = sectionMap[label];
        const section = document.getElementById(sectionId);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

// =========================================
// FEAR & GREED INDEX
// =========================================

async function fetchFearAndGreed() {
    try {
        const response = await fetch(
            "https://api.alternative.me/fng/?limit=1"
        );

        if (!response.ok) {
            throw new Error("Fear & Greed request failed");
        }

        const data = await response.json();

        const value = Number(data.data[0].value);
        const classification = data.data[0].value_classification;

        const valueElement = document.getElementById("fear-value");
        const labelElement = document.getElementById("fear-label");

        if (valueElement) {
            valueElement.textContent = value;
        }

        if (labelElement) {
            labelElement.textContent = classification;
        }

    } catch (error) {
        console.error("Fear & Greed error:", error);
    }
}

fetchFearAndGreed();
});});
