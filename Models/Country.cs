using System;
using System.Collections.Generic;

namespace GlobalSearch.API.Models;

public partial class Country
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string PhoneCode { get; set; } = null!;

    public string IsoCode { get; set; } = null!;

    public virtual ICollection<City> Cities { get; set; } = new List<City>();
}
