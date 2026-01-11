using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GlobalSearch.API.Models;

[Table("Advertisements")]
public class Advertisement
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Title { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string TargetUrl { get; set; } = "https://google.com";
    public string Category { get; set; } = "Genel";
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public DateTime StartDate { get; set; } = DateTime.Now;
    public DateTime EndDate { get; set; } = DateTime.Now.AddMonths(1);
    public bool? IsActive { get; set; } = true;
    public int? ClickCount { get; set; } = 0;

    // Kategoriye özel alanlar
    public int? KM { get; set; } 
    public int? ModelYear { get; set; }
    public string? RoomCount { get; set; }
    public int? SquareMeter { get; set; }

    [JsonIgnore]
    public virtual User? User { get; set; }
}