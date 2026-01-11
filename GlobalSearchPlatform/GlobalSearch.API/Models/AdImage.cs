using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GlobalSearch.API.Models;

[Table("AdImages")]
public class AdImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = null!;
    public int AdvertisementId { get; set; }

    [JsonIgnore]
    public virtual Advertisement? Advertisement { get; set; }
}