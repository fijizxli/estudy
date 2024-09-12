using estudyRatings.Components.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.EntityFrameworkCore.Extensions;

namespace estudyRatings.Components.Data;

public class LecturerDBContext : DbContext
{
    public DbSet<Lecturer> Lecturers { get; init; }
    public static LecturerDBContext Create(IMongoDatabase database) =>
        new(new DbContextOptionsBuilder<LecturerDBContext>()
            .UseMongoDB(database.Client, database.DatabaseNamespace.DatabaseName)
            .Options);
    public LecturerDBContext(DbContextOptions options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Lecturer>().ToCollection("lecturers");
    }
}