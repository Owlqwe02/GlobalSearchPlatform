using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobalSearch.API.Models; // User modelin burada olduğu için gerekli
using GlobalSearch.API.Data;   // GlobalSearchContext burada olduğu için gerekli

namespace GlobalSearch.API.Controllers
{
    [Authorize(Roles = "Admin")] // Sadece Admin rolündekiler erişebilir
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly GlobalSearchContext _context;

        public UsersController(GlobalSearchContext context)
        {
            _context = context;
        }

        // Tüm kullanıcıları listele
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // Kullanıcıyı banla veya banı kaldır
        [HttpPut("ban/{id}")]
        public async Task<IActionResult> ToggleBan(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            user.IsBanned = !user.IsBanned;
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // Admin istediği ilanı silebilir
        [HttpDelete("delete-ad/{id}")]
        public async Task<IActionResult> AdminDeleteAd(int id)
        {
            var ad = await _context.Advertisements.FindAsync(id);
            if (ad == null) return NotFound("İlan bulunamadı.");

            _context.Advertisements.Remove(ad);
            await _context.SaveChangesAsync();
            return Ok(new { message = "İlan admin tarafından silindi." });
        }
    }
}