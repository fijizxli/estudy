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
    [BsonElement("ratings")]
    public List<ObjectId> Ratings { get; set; } = new List<ObjectId>();

    public Course(int id, string title, string description, string lecturerName, List<ObjectId> ratings)
    {
        Id = id;
        Title = title;
        Description = description;
        LecturerName = lecturerName;
        Ratings = ratings;
    }

    public Course(int id, string title, string description, string lecturerName, int lecturer, List<ObjectId> ratings)
    {
        Id = id;
        Title = title;
        Description = description;
        LecturerName = lecturerName;
        Lecturer = lecturer;
        Ratings = ratings;
    }

    public Course()
    {
    }

    public override bool Equals(object obj)
    {
        if (obj is Course other)
        {
            return this.Id == other.Id;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Id);   
    }
}