async function fetchCryptoPrices() {
    try {
        // جلب البيانات من CoinGecko API
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        
        // التحقق مما إذا كان API يعمل بشكل صحيح
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // الحصول على العنصر HTML الذي سيحمل البيانات
        const tickerElement = document.getElementById('crypto-ticker');
        
        // تفريغ أي بيانات قديمة
        tickerElement.innerHTML = '';

        // إنشاء العناصر الديناميكية
        data.forEach(coin => {
            const coinElement = document.createElement('div');
            coinElement.classList.add('ticker-item');
            coinElement.innerHTML = `<img src="${coin.image}" width="20"> ${coin.name}: $${coin.current_price}`;
            tickerElement.appendChild(coinElement);
        });

        console.log("✅ تم تحديث بيانات العملات بنجاح!");
    } catch (error) {
        console.error("❌ خطأ في جلب بيانات العملات الرقمية:", error);
    }
}

// تحديث الأسعار عند تحميل الصفحة
fetchCryptoPrices();

// تحديث الأسعار كل 60 ثانية
setInterval(fetchCryptoPrices, 60000);


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

