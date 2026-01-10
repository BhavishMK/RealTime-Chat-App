using System.ComponentModel.DataAnnotations.Schema;

namespace Tetherfi.Chat.Service.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public int? ReplyToMessageId { get; set; }

        [ForeignKey("ReplyToMessageId")]
        public virtual Message? ReplyToMessage { get; set; }
    }
}