using MongoDB.Bson.Serialization.Attributes;

namespace estudyRatings.Components.Models;
    
public class Lecturer
{
    [BsonId]
    public int Id { get; set; }
    [BsonElement("username")]
    public string Username { get; set; }
    [BsonElement("email")]
    public string EmailAddress { get; set; }
    [BsonElement("ratings")]
    public List<Rating> Ratings { get; set; }
    
    [BsonElement("courses")]
    public HashSet<Course> courses { get; set; }
    
    public Lecturer(int id, string username, string emailAddress)
    {
        this.Id = id;
        this.Username = username;
        this.EmailAddress = emailAddress;
    }
    public Lecturer(int id, string username, string emailAddress, HashSet<Course> courses)
    {
        this.Id = id;
        this.Username = username;
        this.EmailAddress = emailAddress;
        this.courses = courses;
    }
}