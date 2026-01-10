using Microsoft.EntityFrameworkCore;

namespace GlobalSearch.API.Models
{
    [Index(nameof(Username), IsUnique = true)] // Aynı isimle kayıt olunamaz
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // Admin veya User
        public bool IsBanned { get; set; } = false; // Ban durumu
    }
}