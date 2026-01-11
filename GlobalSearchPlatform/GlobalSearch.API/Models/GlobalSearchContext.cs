using Microsoft.EntityFrameworkCore;
using GlobalSearch.API.Models;

namespace GlobalSearch.API.Data
{
    public class GlobalSearchContext : DbContext
    {
        public GlobalSearchContext(DbContextOptions<GlobalSearchContext> options) : base(options) { }

        public DbSet<Advertisement> Advertisements { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Burada Advertisement.Email veya Description ile ilgili hatalı satırlar varsa temizlenmiş oldu.
        }
    }
}