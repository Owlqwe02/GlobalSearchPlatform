using GlobalSearch.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS: Tarayıcıdaki engellemeyi kaldırır
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 2. VERİTABANI: SmarterASP.NET bağlantı cümlesi (Virgül ve TrustServerCertificate eklendi)
var connectionString = "Server=sql8010.site4now.net,1433;Database=db_ac39fa_globalsearch;User Id=db_ac39fa_globalsearch_admin;Password=mk112100;TrustServerCertificate=True;";

builder.Services.AddDbContext<GlobalSearchContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// 3. MIDDLEWARE SIRALAMASI: CORS en üstte olmalı
app.UseCors("AllowAll"); 
app.UseStaticFiles(); 
app.UseAuthorization();
app.MapControllers();
app.Run();