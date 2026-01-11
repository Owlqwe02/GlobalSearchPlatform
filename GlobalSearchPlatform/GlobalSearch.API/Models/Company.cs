using System;
using System.Collections.Generic;

namespace GlobalSearch.API.Models;

public partial class Company
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? CategoryId { get; set; }

    public int? CityId { get; set; }

    public string Name { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string? Description { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? WebsiteUrl { get; set; }

    public string? WhatsappNumber { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public bool? IsVerified { get; set; }

    public bool? IsFeatured { get; set; }

    public int? ViewCount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Category? Category { get; set; }

    public virtual City? City { get; set; }

    public virtual ICollection<CompanyImage> CompanyImages { get; set; } = new List<CompanyImage>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual User? User { get; set; }
}
