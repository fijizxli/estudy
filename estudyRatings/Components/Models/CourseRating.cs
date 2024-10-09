using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace estudyRatings.Components.Models;
public class CourseRating
{
    [BsonId]
    public ObjectId Id { get; set; }
    [BsonElement("CourseId")]
    public int CourseId { get; set; }
    [BsonElement("practicalApplication")]
    public int PracticalApplication{ get; set; }
    [BsonElement("assignments")]
    public int Assignments { get; set; }
    [BsonElement("grading")]
    public int Grading { get; set; }
    [BsonElement("comment")]
    public string? Comment { get; set; }
    [BsonElement("date-added")]
    public DateTime DateAdded { get; set; }

    public CourseRating()
    {
    }
    public CourseRating(ObjectId id, int courseId, int practicalApplication, 
    int assignments, int grading, string comment, DateTime date)
    {
        Id = id;
        CourseId = courseId;
        PracticalApplication = practicalApplication;
        Assignments = assignments;
        Grading = grading;
        Comment = comment;
        DateAdded = date;
    }
}