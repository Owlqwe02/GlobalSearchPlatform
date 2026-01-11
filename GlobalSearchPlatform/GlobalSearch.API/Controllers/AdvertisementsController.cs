using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobalSearch.API.Models;
using GlobalSearch.API.Data;

namespace GlobalSearch.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementsController : ControllerBase
    {
        private readonly GlobalSearchContext _context;

        public AdvertisementsController(GlobalSearchContext context)
        {
            _context = context;
        }

        // 1. TÜM İLANLARI GETİR
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Advertisement>>> GetAds()
        {
            return await _context.Advertisements
                .OrderByDescending(a => a.Id)
                .ToListAsync();
        }

        // 2. TEK İLAN GETİR
        [HttpGet("{id}")]
        public async Task<ActionResult<Advertisement>> GetAdvertisement(int id)
        {
            var advertisement = await _context.Advertisements.FirstOrDefaultAsync(a => a.Id == id);
            if (advertisement == null) return NotFound();
            return advertisement;
        }

        // 3. YENİ İLAN OLUŞTUR (Hata Vermeyen Güvenli Kayıt)
        [HttpPost]
        public async Task<ActionResult<Advertisement>> PostAdvertisement(Advertisement advertisement)
        {
            try
            {
                // TargetUrl gibi alanların boş gelme ihtimaline karşı varsayılan değer atıyoruz
                if (string.IsNullOrEmpty(advertisement.TargetUrl))
                    advertisement.TargetUrl = "https://google.com";

                _context.Advertisements.Add(advertisement);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetAdvertisement", new { id = advertisement.Id }, advertisement);
            }
            catch (Exception ex)
            {
                // 500 hatası alındığında detaylı hata mesajını döner
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        // 4. RESİM YÜKLEME (405 Hatasını Çözen Metod)
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Dosya seçilmedi.");

            var folderName = Path.Combine("wwwroot", "uploads");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (!Directory.Exists(pathToSave)) Directory.CreateDirectory(pathToSave);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(pathToSave, fileName);
            var dbPath = $"/uploads/{fileName}";

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Frontend'in erişebilmesi için tam URL döner
            return Ok(new { url = $"http://localhost:5295{dbPath}" });
        }

        // 5. İLAN GÜNCELLE
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdvertisement(int id, Advertisement advertisement)
        {
            if (id != advertisement.Id) return BadRequest();

            _context.Entry(advertisement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Advertisements.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // 6. İLAN SİL
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAd(int id)
        {
            var ad = await _context.Advertisements.FindAsync(id);
            if (ad == null) return NotFound();

            _context.Advertisements.Remove(ad);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 7. TIKLAMA SAYISINI ARTIR
        [HttpPost("click/{id}")]
        public async Task<IActionResult> IncrementClick(int id)
        {
            var ad = await _context.Advertisements.FindAsync(id);
            if (ad == null) return NotFound();

            ad.ClickCount = (ad.ClickCount ?? 0) + 1;
            await _context.SaveChangesAsync();
            return Ok(new { count = ad.ClickCount });
        }
    }
}