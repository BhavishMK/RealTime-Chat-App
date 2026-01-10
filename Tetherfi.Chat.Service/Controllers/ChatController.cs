using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Tetherfi.Chat.Service.Data;

namespace Tetherfi.Chat.Service.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public ChatController(ChatDbContext context) => _context = context;

        [HttpGet("history/{otherUserId}")]
        public async Task<IActionResult> GetChatHistory(int otherUserId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var messages = await _context.Messages
                .Where(m => (m.SenderId == currentUserId && m.ReceiverId == otherUserId) ||
                            (m.SenderId == otherUserId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.Timestamp)
                .Select(m => new {
                    m.Id,
                    m.SenderId,
                    m.ReceiverId,
                    m.Content,
                    m.Timestamp,
                    m.ReplyToMessageId
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            // Fetch all users and their current status for the sidebar
            var users = await _context.Users
                .Select(u => new { u.Id, u.Username, u.Status })
                .ToListAsync();
            return Ok(users);
        }
    }
}