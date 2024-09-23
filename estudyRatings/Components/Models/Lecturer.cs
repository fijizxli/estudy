using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace estudyRatings.Components.Models;
    
public class Lecturer
{
    [BsonId]
    public int Id { get; set; }
    [BsonElement("username")]
    public string Username { get; set; }
    [BsonElement("emailAddress")]
    public string EmailAddress { get; set; }
    [BsonElement("ratings")]
    public List<ObjectId> Ratings { get; set; } = new List<ObjectId>();

    
    [BsonElement("coursesTaught")]
    public List<int> courses { get; set; }

    public override string ToString()
    {
        return base.ToString();
    }

    public Lecturer(int id, string username, string emailAddress)
    {
        this.Id = id;
        this.Username = username;
        this.EmailAddress = emailAddress;
    }
    public Lecturer(int id, string username, string emailAddress, List<int> courses)
    {
        this.Id = id;
        this.Username = username;
        this.EmailAddress = emailAddress;
        this.courses = courses;
    }

    public Lecturer()
    {
    }
}