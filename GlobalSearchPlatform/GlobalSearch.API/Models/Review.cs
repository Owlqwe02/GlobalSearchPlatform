using System;
using System.Collections.Generic;

namespace GlobalSearch.API.Models;

public partial class Review
{
    public int Id { get; set; }

    public int? CompanyId { get; set; }

    public int? UserId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Company? Company { get; set; }

    public virtual User? User { get; set; }
}
