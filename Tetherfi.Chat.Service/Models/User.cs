namespace Tetherfi.Chat.Service.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Status { get; set; } = "Available"; 
        public DateTime LastSeen { get; set; } = DateTime.UtcNow;

        
    }
}