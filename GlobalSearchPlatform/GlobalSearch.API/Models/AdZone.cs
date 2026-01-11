using System;
using System.Collections.Generic;

namespace GlobalSearch.API.Models;

public partial class AdZone
{
    public int Id { get; set; }

    public string ZoneName { get; set; } = null!;

    public decimal PricePerDay { get; set; }

    public string? Dimension { get; set; }

    public virtual ICollection<Advertisement> Advertisements { get; set; } = new List<Advertisement>();
}
