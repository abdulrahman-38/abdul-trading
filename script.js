// التأكد من أن السكريبت يعمل بعد تحميل الصفحة بالكامل
document.addEventListener("DOMContentLoaded", function () {

    // دالة فتح وإغلاق القائمة الجانبية
    function toggleSidebar() {
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.toggle("active");
    }

    // ربط زر القائمة بدالة الفتح/الإغلاق
    document.querySelector(".menu-toggle").addEventListener("click", toggleSidebar);

    // إغلاق القائمة عند الضغط على أي رابط داخلها
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", () => {
            document.getElementById("sidebar").classList.remove("active");
        });
    });

    // شريط الأسعار المتحرك
    async function fetchCryptoPrices() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const tickerElement = document.getElementById("crypto-ticker");
            tickerElement.innerHTML = "";

            data.forEach(coin => {
                const coinElement = document.createElement("div");
                coinElement.classList.add("ticker-item");
                coinElement.innerHTML = `<img src="${coin.image}" width="20"> ${coin.name}: $${coin.current_price}`;
                tickerElement.appendChild(coinElement);
            });

            // تكرار المحتوى لجعل الشريط المتحرك يعمل بسلاسة
            const duplicateContent = tickerElement.innerHTML;
            tickerElement.innerHTML += duplicateContent;

            console.log("✅ تم تحديث بيانات العملات بنجاح!");
        } catch (error) {
            console.error("❌ خطأ في جلب بيانات العملات الرقمية:", error);
        }
    }

    // تحديث الأسعار عند تحميل الصفحة
    fetchCryptoPrices();

    // تحديث الأسعار كل 60 ثانية
    setInterval(fetchCryptoPrices, 60000);
});

