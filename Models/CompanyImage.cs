using System;
using System.Collections.Generic;

namespace GlobalSearch.API.Models;

public partial class CompanyImage
{
    public int Id { get; set; }

    public int? CompanyId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool? IsCover { get; set; }

    public virtual Company? Company { get; set; }
}
