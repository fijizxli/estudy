using estudyRatings.Components;
using MongoDB.Driver;

var mongo_user = Environment.GetEnvironmentVariable("MONGO_USER");
var mongo_password = Environment.GetEnvironmentVariable("MONGO_PASSWORD");
var mongo_host = Environment.GetEnvironmentVariable("MONGO_HOST");
var mongo_port = Environment.GetEnvironmentVariable("MONGO_PORT");
var mongo_db = Environment.GetEnvironmentVariable("MONGO_DB");
var connectionString = "mongodb://"+mongo_user+":"+mongo_password+"@"+mongo_host+":"+mongo_port+"/"+mongo_db+"?authSource=admin";
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
builder.Configuration.AddEnvironmentVariables();

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
