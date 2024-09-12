using MongoDB.Bson.Serialization.Attributes;

namespace estudyRatings.Components.Models;
public class Rating(int id, Lecturer owner, string lecturer, int qualityOfLectures, int qualityOfStudyMaterials, int personality, string comment)
{
    [BsonId]
    public int Id { get; set; } = id;
    [BsonElement("lecturer")]
    public string lecturer { get; set; } = lecturer;
    [BsonElement("qualityOfLectures")]
    public int QualityOfLectures { get; set; } = qualityOfLectures;
    [BsonElement("qualityOfStudyMaterials")]
    public int QualityOfStudyMaterials { get; set; } = qualityOfStudyMaterials;
    [BsonElement("personality")]
    public int Personality { get; set; } = personality;
    [BsonElement("comment")]
    public string Comment { get; set; } = comment;
}