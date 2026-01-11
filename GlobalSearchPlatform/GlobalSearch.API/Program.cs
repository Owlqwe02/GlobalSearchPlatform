using GlobalSearch.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// CORS: Bağlantı reddini engellemek için kritik
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddDbContext<GlobalSearchContext>(options =>
    options.UseSqlServer("Server=.\\SQLEXPRESS;Database=GlobalSearchDB;Trusted_Connection=True;TrustServerCertificate=True;"));

var app = builder.Build();

app.UseStaticFiles(); // upload-multiple için gerekli
app.UseCors("AllowAll"); // CORS politikasını aktif et
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();