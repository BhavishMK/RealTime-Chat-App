namespace Tetherfi.Identity.Service.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Status { get; set; } = "Available"; // Available, Busy, Away, Offline
        public DateTime LastSeen { get; set; } = DateTime.UtcNow;
    }
}
