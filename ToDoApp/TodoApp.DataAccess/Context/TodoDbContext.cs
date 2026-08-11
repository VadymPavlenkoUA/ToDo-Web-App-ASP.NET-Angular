using Microsoft.EntityFrameworkCore;
using TodoApp.DataAccess.Entities;

namespace TodoApp.DataAccess.Context
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users => Set<User>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
        public DbSet<Category> Categories => Set<Category>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Email).IsRequired().HasMaxLength(255);
                entity.Property(x => x.PasswordHash).IsRequired();
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
                entity.HasOne(x => x.User).WithMany(x => x.Categories)
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Title).IsRequired().HasMaxLength(200);
                entity.Property(x => x.Description).HasMaxLength(2000);
                entity.HasOne(x => x.User).WithMany(x => x.Tasks).HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.NoAction);
                entity.HasOne(x => x.Category).WithMany(x => x.Tasks).HasForeignKey(x => x.CategoryId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}
