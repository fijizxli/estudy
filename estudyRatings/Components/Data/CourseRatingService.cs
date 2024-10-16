using estudyRatings.Components.Models;
using System.Text.Json;
using MongoDB.Driver;
using System.Text.Json.Nodes;

public class CourseRatingService {
    private readonly IMongoCollection<CourseRating> _courseRatingCollection;
    private readonly string OFFENSIVE_CHECKER_SERVICE = "";

    public CourseRatingService(IMongoClient mongoClient, IConfiguration configuration){
        var database = mongoClient.GetDatabase("ratings");
        _courseRatingCollection = database.GetCollection<CourseRating>("courseRatings");
        OFFENSIVE_CHECKER_SERVICE += configuration["OFFCHECK_HOST"]+":"+configuration["OFFCHECK_PORT"];
    }

    public async Task<CourseRating?> InsertRating(CourseRating rating)
    {
        if (rating.Comment != null){
            if (!string.IsNullOrEmpty(OFFENSIVE_CHECKER_SERVICE)){
                HttpClient client = new HttpClient();
                try
                {
                    using HttpResponseMessage response = await client.GetAsync("http://"+OFFENSIVE_CHECKER_SERVICE+"/check?s="+rating.Comment.ToString());
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();

                    JsonNode offensiveNode = JsonNode.Parse(responseBody)!;

                    bool offensive = (bool)offensiveNode["offensive"];
                    if (!offensive){
                        await _courseRatingCollection.InsertOneAsync(rating);
                        return rating;
                    }
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine("\nException Caught!");
                    Console.WriteLine("Message :{0} ", e.Message);
                }
            }
        }
        return null;
    }

    public async Task<List<CourseRating>> GetRatingsByCourseIdAsync(int id)
    {
        return await _courseRatingCollection.Find(r => r.CourseId == id).ToListAsync();
    }

    public async Task<List<CourseRating>> GetLatestCourseRatings(int max){
        var sort = Builders<CourseRating>.Sort.Descending("date-added");
        var filter = Builders<CourseRating>.Filter.Empty;

        return await _courseRatingCollection.Find(filter).Sort(sort).Limit(max).ToListAsync();
    }
}
