using estudyRatings.Components;
using MongoDB.Driver;

//var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
var connectionString = "mongodb://root:example@localhost:27017/ratings?authSource=admin";
if (connectionString == null)
{
    Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, " +
                      "see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string"
                      );
    Environment.Exit(0);
}
MongoClient client = new MongoClient(connectionString);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton<IMongoClient>(client);
builder.Services.AddSingleton<LecturerService>();
builder.Services.AddSingleton<CourseService>();
builder.Services.AddSingleton<RatingService>();
builder.Services.AddSingleton<CourseRatingService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
