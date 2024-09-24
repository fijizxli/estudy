using estudyRatings.Components.Models;
using MongoDB.Driver;

public class CourseRatingService {
    private readonly IMongoCollection<CourseRating> _courseRatingCollection;

    public CourseRatingService(IMongoClient mongoClient){
        var database = mongoClient.GetDatabase("ratings");
        _courseRatingCollection = database.GetCollection<CourseRating>("courseRatings");
    }

    public async Task<CourseRating> InsertRating(CourseRating rating)
    {
        await _courseRatingCollection.InsertOneAsync(rating);
        return rating;
    }

    public async Task<List<CourseRating>> GetRatingsByCourseIdAsync(int id)
    {
        return await _courseRatingCollection.Find(r => r.CourseId == id).ToListAsync();
    }
}
