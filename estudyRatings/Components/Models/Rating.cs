using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace estudyRatings.Components.Models;
public class Rating
{
    [BsonId]
    public int Id { get; set; }
    [BsonElement("LecturerId")]
    public int LecturerId { get; set; }
    [BsonElement("qualityOfLectures")]
    public int QualityOfLectures { get; set; }
    [BsonElement("qualityOfStudyMaterials")]
    public int QualityOfStudyMaterials { get; set; }
    [BsonElement("personality")]
    public int Personality { get; set; }
    [BsonElement("comment")]
    public string? Comment { get; set; }

    public Rating()
    {
    }
    public Rating(int id, int lecturerId, int qualityOfLectures, 
    int qualityOfStudyMaterials, int personality, string comment)
    {
        Id = id;
        LecturerId = lecturerId;
        QualityOfLectures = qualityOfLectures;
        QualityOfStudyMaterials = qualityOfStudyMaterials;
        Personality = personality;
        Comment = comment;
    }
}