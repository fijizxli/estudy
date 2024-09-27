using estudyRatings.Components.Models;
using System.Text.Json;
using MongoDB.Driver;
using System.Text.Json.Nodes;

public class CourseRatingService {
    private readonly IMongoCollection<CourseRating> _courseRatingCollection;

    public CourseRatingService(IMongoClient mongoClient){
        var database = mongoClient.GetDatabase("ratings");
        _courseRatingCollection = database.GetCollection<CourseRating>("courseRatings");
    }

    public async Task<CourseRating?> InsertRating(CourseRating rating)
    {
        if (rating.Comment != null){
            HttpClient client = new HttpClient();
            try
            {
                using HttpResponseMessage response = await client.GetAsync("http://localhost:8000/check?s="+rating.Comment.ToString());
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();

                JsonNode offensiveNode = JsonNode.Parse(responseBody)!;


                bool offensive = (bool)offensiveNode["offensive"];
                await _courseRatingCollection.InsertOneAsync(rating);
                return rating;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
            }
        }
        return null;
    }

    public async Task<List<CourseRating>> GetRatingsByCourseIdAsync(int id)
    {
        return await _courseRatingCollection.Find(r => r.CourseId == id).ToListAsync();
    }
}
