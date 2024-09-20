using MongoDB.Bson;
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
    [BsonElement("lecturer")]
    public int Lecturer { get; set; }

    public Course(int id, string title, string description, string lecturerName)
    {
        Id = id;
        Title = title;
        Description = description;
        LecturerName = lecturerName;
    }

    public Course(int id, string title, string description, string lecturerName, int lecturer)
    {
        Id = id;
        Title = title;
        Description = description;
        LecturerName = lecturerName;
        Lecturer = lecturer;
    }

    public Course()
    {
    }
}