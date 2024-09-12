using estudyRatings.Components;
using estudyRatings.Components.Data;
using MongoDB.Driver;

//var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
var connectionString = 
    Environment.GetEnvironmentVariable("mongodb://root:example@localhost:27017/ratings?authSource=admin");
if (connectionString == null)
{
    Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, " +
                      "see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string"
                      );
    Environment.Exit(0);
}
var client = new MongoClient(connectionString);
var db = LecturerDBContext.Create(client.GetDatabase("lecturers"));

db.Database.EnsureCreated();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios,
    // see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
