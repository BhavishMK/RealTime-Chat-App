namespace Tetherfi.Chat.Service.DTOs
{
    public class SendMessageDto
    {
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? ReplyToMessageId { get; set; }
    }

    public class MessageResponseDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public int? ReplyToMessageId { get; set; }
        public string? ReplyToContent { get; set; } 
    }
}