using estudyRatings.Components.Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class LecturerService {
    private readonly IMongoCollection<Lecturer> _lecturersCollection;

    public LecturerService(IMongoClient mongoClient){
        var database = mongoClient.GetDatabase("ratings");
        _lecturersCollection = database.GetCollection<Lecturer>("lecturers");
    }

    public async Task<Lecturer> GetLecturerByIdAsync(string id)
    {
        var objectId = Int32.Parse(id);
        return await _lecturersCollection.Find(x => x.Id == objectId).FirstOrDefaultAsync();
    }

    public async Task<List<Lecturer>> GetLecturers()
    {
        var lecturers = _lecturersCollection.Find(_ => true).ToListAsync();
        return await lecturers;
    }

    public async Task<List<Lecturer>> GetLecturersByUsername(string searchTerm){
        var filter = Builders<Lecturer>.Filter.Regex("Username", new BsonRegularExpression(".*" + searchTerm + ".*", "i"));
        var lecturers = _lecturersCollection.Find(filter).ToListAsync();

        return await lecturers;
    }

    public async Task AddRatingToLecturer(int lecturerId, ObjectId ratingId){
        var filter = Builders<Lecturer>.Filter.Eq(l => l.Id, lecturerId);
        var update = Builders<Lecturer>.Update.Push(l => l.Ratings, ratingId);
        await _lecturersCollection.UpdateOneAsync(filter, update);
    }
}