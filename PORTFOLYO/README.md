# Portfolyo Projesi Çalıştırma Kılavuzu

Bu proje, güvenlik kısıtlamaları (örneğin JSON dosyalarını okumak(fetch etmek)) nedeniyle doğrudan `index.html` dosyasına çift tıklanarak (file:// protokolü ile) tam işlevsel olarak çalıştırılamaz. Projeyi sorunsuz görüntülemek için yerel bir sunucu (local server) gereklidir.

## Nasıl Çalıştırılır?

Bilgisayarı her yeniden başlattığınızda uğraşmamanız için bir **baslat.bat** dosyası eklenmiştir.

1. Proje klasöründeki (PORTFOLYO) **`baslat.bat`** dosyasına çift tıklayın.
2. Bu işlem otomatik olarak yerel bir sunucu başlatacak (Port: 5500) ve standart tarayıcınızda (Chrome/Edge vb.) portfolyoyu açacaktır.
3. Çalıştığı adres: `http://localhost:5500`

### Manuel Olarak Çalıştırmak İsterseniz:
Eğer `baslat.bat` çalışmazsa, bilgisayarınızda **Python** kuruluysa terminali (CMD/PowerShell) projenin bulunduğu klasörde açıp şu komutu yazabilirsiniz:

```bash
python -m http.server 5500
```

Ardından tarayıcınızda şu adresi ziyaret edin: `http://localhost:5500`

## Sorun Giderme
- Siteye girdiğinizde veriler (projeler, yetenekler vb.) yüklenmiyorsa (ekranda "Yükleniyor..." yazısı kalıyorsa), yerel sunucuyu açmadan direkt `index.html`'ye tıklamış olabilirsiniz. Lütfen yukarıdaki yöntemi kullanın.
- Eğer `5500` portu başka bir uygulama tarafından kullanılıyorsa, bat dosyasını bir metin editörüyle açıp `5500` olan sayıları boş olan başka bir port numarasıyla (örn: `8000`, `8888`) değiştirebilirsiniz.
