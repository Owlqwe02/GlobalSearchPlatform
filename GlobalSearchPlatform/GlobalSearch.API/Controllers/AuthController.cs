using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobalSearch.API.Data;
using GlobalSearch.API.Models;

namespace GlobalSearch.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly GlobalSearchContext _context;

        public AuthController(GlobalSearchContext context)
        {
            _context = context;
        }

      [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] User user)
{
    // Kullanıcı adı var mı kontrol et
    if (await _context.Users.AnyAsync(u => u.Username == user.Username))
    {
        return BadRequest("Bu kullanıcı adı zaten alınmış.");
    }

    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return Ok();
}

[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] User loginUser)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Username == loginUser.Username && u.Password == loginUser.Password);

    if (user == null) return Unauthorized("Hatalı kullanıcı adı veya şifre.");
if (user.Username == "mkmk") 
{
    user.Role = "Admin"; // Veritabanında ne yazarsa yazsın, bu kişiyi Admin say!
}
    // BURASI ÇOK ÖNEMLİ:
    if (user.IsBanned) return BadRequest("Hesabınız yöneticiler tarafından banlanmıştır!");

    return Ok(user);
}
        }
    }

