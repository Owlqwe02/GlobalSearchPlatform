using System;
using System.Collections.Generic;

namespace GlobalSearch.API.Models;

public partial class City
{
    public int Id { get; set; }

    public int? CountryId { get; set; }

    public string Name { get; set; } = null!;

    public int? PlateCode { get; set; }

    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();

    public virtual Country? Country { get; set; }
}
