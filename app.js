// Global Test API Anahtarı ve Sunucu Adresi (OpenWeatherMap altyapısı)
const API_KEY = "3f4237cac022c1c715b42e6cfd5cb342";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// HTML Elementlerini JavaScript Tarafına Bağlıyoruz (DOM Manipülasyonu)
const sehirInput = document.getElementById("sehir-input");
const araBtn = document.getElementById("ara-btn");
const havaKart = document.getElementById("hava-kart");
const hataMesaji = document.getElementById("hata-mesaji");

// ASENKRON API İSTEK MOTORU
async function havaDurumuGetir(sehir) {
    // API'den santigrat (°C) cinsinden veri çekmek için units=metric parametresi ekliyoruz
    const url = `${BASE_URL}?q=${sehir}&appid=${API_KEY}&units=metric&lang=tr`;
    
    try {
        // Sunucuya istek atılıyor ve cevap bekleniyor (Fetch API)
        const cevap = await fetch(url);
        
        // Eğer şehir bulunamadıysa (404 hatası geldiyse)
        if (!cevap.ok) {
            throw new Error("Şehir bulunamadı");
        }
        
        // Gelen ham metin verisini JSON objesine dönüştürüyoruz
        const veri = await cevap.json();
        
        // Kartı doldurma fonksiyonunu tetikle
        kartiGuncelle(veri);
        
    } catch (hata) {
        // Hata durumunda arayüz ayarları
        havaKart.classList.add("gizli");
        hataMesaji.classList.remove("gizli");
    }
}

// ARAYÜZÜ DİNAMİK GÜNCELLEME FONKSİYONU
function kartiGuncelle(veri) {
    // Gelen JSON verisinden cımbızla ihtiyacımız olanları çekiyoruz
    document.getElementById("sehir-adi").innerText = `${veri.name}, ${veri.sys.country}`;
    document.getElementById("derece").innerText = Math.round(veri.main.temp);
    document.getElementById("durum").innerText = veri.weather[0].description;
    document.getElementById("nem").innerText = `%${veri.main.humidity}`;
    document.getElementById("ruzgar").innerText = `${Math.round(veri.wind.speed * 3.6)} km/s`;
    
    // Güncel tarihi yazdır
    const bugun = new Date();
    document.getElementById("tarih").innerText = bugun.toLocaleDateString("tr-TR", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Görünürlük ayarları
    hataMesaji.classList.add("gizli");
    havaKart.classList.remove("gizli");
}

// BUTONA TIKLAMA OLAYI (Event Listener)
araBtn.addEventListener("click", () => {
    const sehir = sehirInput.value.trim();
    if (sehir) {
        havaDurumuGetir(sehir);
    }
});

// ENTER TUŞUNA BASILMA OLAYI
sehirInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const sehir = sehirInput.value.trim();
        if (sehir) {
            havaDurumuGetir(sehir);
        }
    }
});