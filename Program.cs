using GlobalSearch.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS: Vercel'den gelen isteklere izin ver
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 2. PostgreSQL VERİTABANI: Render Internal URL kullanılıyor
// Not: SmarterASP (MSSQL) yerine artık Render'ın kendi Postgres servisine bağlanıyoruz.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "postgresql://globalsearch_db_user:54trAdP67efo2ekm7xuYM9SW7rJLgZUE@dpg-d5huofggjchc73afukjg-a/globalsearch_db";

builder.Services.AddDbContext<GlobalSearchContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// 3. MIDDLEWARE SIRALAMASI
app.UseCors("AllowAll"); 
app.UseStaticFiles(); 
app.UseAuthorization();
app.MapControllers();
app.Run();