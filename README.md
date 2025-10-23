# Sipay-Payment-Integration-API
Full-stack payment gateway service built with .NET Web API and React, featuring Sipay integration and analytical logging endpoints.

# Sipay-Fullstack-Payment-API-Gateway

## Proje Genel Bakışı
Bu proje, bir ödeme geçidi (payment gateway) entegrasyonunun uçtan uca nasıl kurgulanması gerektiğini gösteren, benim tarafımdan geliştirilmiş bir **Full-Stack konsept kanıtıdır (Proof-of-Concept)**.

Temel amaç, sadece ödeme altyapısını kurmak değil, aynı zamanda güvenilir bir **finansal kayıt ve analiz sistemi** oluşturmaktır.

## Teknik Çözümün Mimarisi

### Backend (C# .NET Web API)
Bu katman, hassas işlemleri ve iş mantığını yönetir.

* **Çekirdek Entegrasyon:** Sipay'in 3D Secure API'si ile iletişim kuran temiz ve ayrık bir `SipayService` katmanı kurgulandı.
* **Veri Bütünlüğü:** Entity Framework Core ve SQLite kullanarak her ödeme ve ürün detayını veritabanına logladım (`PaymentLog`, `ItemLog`).
* **İş Zekası:** Loglanmış veriler üzerinden satış verilerini dinamik olarak analiz etmek için (`/total-success-amount` gibi) özel API uç noktaları yazıldı.
* **Güvenlik:** API, React arayüzü ile iletişim kuracak şekilde CORS ayarlarıyla optimize edilmiştir.

### Frontend (React UI)
* **Tasarım:** Kullanıcıdan kart ve sipariş bilgilerini alan, temiz bir ödeme arayüzü (UI) tasarlandı.
* **İletişim:** Veriler, güvenli bir şekilde arka uca gönderilerek ödeme akışı başlatılır.

## Önemli Öğrenimler
Bu projede karşılaştığım temel zorluk, API entegrasyonunda oluşabilecek hatalara karşı sağlam bir `try-catch` ve durum yönetimi mekanizması kurmaktı. Aynı zamanda, veri kayıplarını önlemek için Entity Framework Core loglama yapısını doğru kurgulamak da önemli bir odak noktasıydı.
