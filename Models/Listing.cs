namespace GlobalSearch.API.Models
{
    public class Listing
    {
        public int Id { get; set; }
        
        // İlan Başlığı (Örn: "Sahibinden Temiz Honda")
        public string Title { get; set; } = string.Empty;
        
        // Açıklama
        public string Description { get; set; } = string.Empty;
        
        // Fiyat
        public decimal Price { get; set; }
        
        // Şehir (Örn: "İstanbul")
        public string City { get; set; } = string.Empty;
        
        // İlan Tarihi (Otomatik şimdiki zamanı alır)
        public DateTime CreatedDate { get; set; } = DateTime.Now;
public string? ImageUrl { get; set; }
        // Hangi kategoriye ait? (Bağlantı Anahtarı)
        public int CategoryId { get; set; }
    }
}