using Microsoft.EntityFrameworkCore;
using DatingApp.Api.Models;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DatingApp.Api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options):base(options)
        { }
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // setting up new composite key - person may not like a person more than once
            // this key guarantees uniqueness
            builder.Entity<Like>()
            .HasKey(k=> new {k.LikeeId,k.LikerId});

            builder.Entity<Like>()
            .HasOne(u=> u.Likee)
            .WithMany(u=> u.Likers)
            .HasForeignKey(u=> u.LikeeId)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
            .HasOne(u=> u.Liker)
            .WithMany(u=> u.Likees)
            .HasForeignKey(u=> u.LikerId)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
    {
        public DataContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

            var builder = new DbContextOptionsBuilder<DataContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlite(connectionString);
            return new DataContext(builder.Options);
        }
    }
}