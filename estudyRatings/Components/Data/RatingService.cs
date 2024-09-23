using estudyRatings.Components.Models;
using MongoDB.Driver;

public class RatingService {
    private readonly IMongoCollection<Rating> _ratingCollection;

    public RatingService(IMongoClient mongoClient){
        var database = mongoClient.GetDatabase("ratings");
        _ratingCollection = database.GetCollection<Rating>("ratings");
    }

    public async Task<Rating> InsertRating(Rating rating)
    {
        await _ratingCollection.InsertOneAsync(rating);
        return rating;
    }

    public async Task<List<Rating>> GetRatingsByLecturerIdAsync(int id)
    {
        return await _ratingCollection.Find(r => r.LecturerId == id).ToListAsync();
    }
}
