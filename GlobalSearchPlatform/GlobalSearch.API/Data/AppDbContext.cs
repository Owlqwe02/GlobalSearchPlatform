using Microsoft.EntityFrameworkCore;
using GlobalSearch.API.Models;

namespace GlobalSearch.API.Data
{
    public class AppDbContext : DbContext
    {
        // BU KISIM ÇOK KRİTİK. HATA BURADAKİ EKSİKTEN ÇIKABİLİR:
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        { 
        }
    public  DbSet<Advertisement> Advertisements { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Listing> Listings { get; set; }
    }
}