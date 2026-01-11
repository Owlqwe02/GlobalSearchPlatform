using GlobalSearch.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS: Vercel'den gelen isteklerin engellenmemesi için "AllowAll" politikası
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin() // Tüm kökenlere izin ver
              .AllowAnyMethod() // GET, POST, DELETE vb. hepsine izin ver
              .AllowAnyHeader(); // Tüm başlıklara izin ver
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 2. VERİTABANI: SmarterASP.NET bağlantı cümlesini Render üzerinden buraya okutuyoruz
// Environment Variable'dan gelmezse kodun içindeki bu adresi kullanacak
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=sql8010.site4now.net,1433;Database=db_ac39fa_globalsearch;User Id=db_ac39fa_globalsearch_admin;Password=mk112100;TrustServerCertificate=True;";

builder.Services.AddDbContext<GlobalSearchContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// 3. MIDDLEWARE SIRALAMASI: CORS her zaman en üstte olmalı
app.UseCors("AllowAll"); 
app.UseStaticFiles(); 
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();