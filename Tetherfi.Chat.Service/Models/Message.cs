using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tetherfi.Chat.Service.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SenderId { get; set; }

        [Required]
        public int ReceiverId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // The Foreign Key ID
        public int? ReplyToMessageId { get; set; }

        // The Navigation Property (The FIX: DbContext needs this to exist)
        [ForeignKey("ReplyToMessageId")]
        public virtual Message? ReplyToMessage { get; set; }
    }
}