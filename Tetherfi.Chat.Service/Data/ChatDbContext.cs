using Microsoft.EntityFrameworkCore;
using Tetherfi.Chat.Service.Models;

namespace Tetherfi.Chat.Service.Data
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options) { }

        public DbSet<Message> Messages { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Message entity
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(m => m.Id);

                // Configure the Self-Referencing relationship for the Reply feature
                entity.HasOne(m => m.ReplyToMessage)
                    .WithMany()
                    .HasForeignKey(m => m.ReplyToMessageId)
                    .OnDelete(DeleteBehavior.SetNull); // If original message is deleted, reply stays
            });
        }
    }
}