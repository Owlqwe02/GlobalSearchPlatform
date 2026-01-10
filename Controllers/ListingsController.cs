using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GlobalSearch.API.Data;
using GlobalSearch.API.Models;

namespace GlobalSearch.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ListingsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Tüm İlanları Getir
        [HttpGet]public async Task<ActionResult<IEnumerable<Listing>>> GetListings(int? categoryId)
        {
            
            var query = _context.Listings.AsQueryable();

            if (categoryId.HasValue && categoryId.Value > 0)
            {
                query = query.Where(l => l.CategoryId == categoryId.Value);
            }

            return await query.ToListAsync();
        }// 3. Tek Bir İlanı Getir (Detay Sayfası İçin)
        [HttpGet("{id}")]
        public async Task<ActionResult<Listing>> GetListing(int id)
        {
            var listing = await _context.Listings.FindAsync(id);

            if (listing == null)
            {
                return NotFound();
            }

            return listing;
        }

        // 2. Yeni İlan Ekle
        [HttpPost]
        public async Task<ActionResult<Listing>> PostListing(Listing listing)
        {
            _context.Listings.Add(listing);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetListings", new { id = listing.Id }, listing);
        }// GET: api/Listings/5
// ... (diğer kodlarınız burada) ...

// --- BU KODU EKLEYİN ---
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteListing(int id)
{
    // Veritabanında bu ID'ye sahip ilanı bul
    var listing = await _context.Listings.FindAsync(id);

    // Eğer ilan yoksa 404 hatası dön
    if (listing == null)
    {
        return NotFound();
    }

    // İlanı silme listesine ekle
    _context.Listings.Remove(listing);

    // Değişiklikleri veritabanına kaydet
    await _context.SaveChangesAsync();

    // İşlem başarılı (204 No Content) dön
    return NoContent();
}

    }
}