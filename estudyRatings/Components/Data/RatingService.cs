using System.Text.Json.Nodes;
using estudyRatings.Components.Models;
using MongoDB.Driver;

public class RatingService {
    private readonly IMongoCollection<Rating> _ratingCollection;
    private readonly string OFFENSIVE_CHECKER_SERVICE = "";

    public RatingService(IMongoClient mongoClient, IConfiguration configuration){
        var database = mongoClient.GetDatabase("ratings");
        _ratingCollection = database.GetCollection<Rating>("ratings");
        OFFENSIVE_CHECKER_SERVICE += configuration["OFFCHECK_HOST"]+":"+configuration["OFFCHECK_PORT"];
    }

    public async Task<Rating?> InsertRating(Rating rating)
    {
        if (!string.IsNullOrEmpty(OFFENSIVE_CHECKER_SERVICE)){
            if (rating.Comment != null){
                HttpClient client = new HttpClient();
                try
                {
                    using HttpResponseMessage response = await client.GetAsync("http://"+OFFENSIVE_CHECKER_SERVICE+"/check?s="+rating.Comment.ToString());
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();

                    JsonNode offensiveNode = JsonNode.Parse(responseBody)!;


                    bool offensive = (bool)offensiveNode["offensive"];

                    if (!offensive){
                        await _ratingCollection.InsertOneAsync(rating);
                    }
                    return rating;
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

    public async Task<List<Rating>> GetRatingsByLecturerIdAsync(int id)
    {
        return await _ratingCollection.Find(r => r.LecturerId == id).ToListAsync();
    }

    public async Task<List<Rating>> GetLatestRatings(int max){
        var sort = Builders<Rating>.Sort.Descending("date-added");
        var filter = Builders<Rating>.Filter.Empty;

        return await _ratingCollection.Find(filter).Sort(sort).Limit(max).ToListAsync();
    }
}
