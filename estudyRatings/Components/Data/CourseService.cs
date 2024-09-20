using estudyRatings.Components.Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class CourseService {
    private readonly IMongoCollection<Course> _courseCollection;

    public CourseService(IMongoClient mongoClient){
        var database = mongoClient.GetDatabase("ratings");
        _courseCollection = database.GetCollection<Course>("courses");
    }

    public async Task<Course> GetCourseByIdAsync(string id)
    {
        var objectId = Int32.Parse(id);
        return await _courseCollection.Find(x => x.Id == objectId).FirstOrDefaultAsync();
    }
 
    public Course GetCourseById(string id)
    {
        var objectId = Int32.Parse(id);
        return _courseCollection.Find(x => x.Id == objectId).First();
    }   

    public async Task<List<Course>> GetCourses()
    {
        var courses = _courseCollection.Find(_ => true).ToListAsync();
        return await courses;
    }

    public async Task<List<Course>> GetCourseByTitle(string searchTerm){
        var filter = Builders<Course>.Filter.Regex("Title", new BsonRegularExpression(".*" + searchTerm + ".*", "i"));
        var courses = _courseCollection.Find(filter).ToListAsync();
        return await courses;
    }
}