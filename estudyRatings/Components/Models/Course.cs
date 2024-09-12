using MongoDB.Bson.Serialization.Attributes;

namespace estudyRatings.Components.Models;

public class Course
{
    [BsonId]
    public int Id { get; set; }
    [BsonElement("title")]
    public string Title { get; set; }
    [BsonElement("description")]
    public string Description { get; set; }
    [BsonElement("lecturerName")]
    public string LecturerName { get; set; }
    [BsonElement("ratings")]
    public List<Rating> Ratings { get; set; }

    public Course(int id, string title, string description, string lecturerName)
    {
        Id = id;
        Title = title;
        Description = description;
        LecturerName = lecturerName;
    }

    public Course(int id, string title, string description, string lecturerName, List<Rating> ratings)
    {
        Id = id;
        Title = title;
        Description = description;
        LecturerName = lecturerName;
        Ratings = ratings;
    }
}