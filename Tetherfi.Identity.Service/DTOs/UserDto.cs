namespace Tetherfi.Identity.Service.DTOs
{
    public class UserRegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserLoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserData User { get; set; } = new();
    }

    public class UserData
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}