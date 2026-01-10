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
    public class MessagesController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public MessagesController(ChatDbContext context)
        {
            _context = context;
        }

        [HttpGet("history/{receiverId}")]
        public async Task<IActionResult> GetChatHistory(int receiverId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var messages = await _context.Messages
                .Where(m => (m.SenderId == currentUserId && m.ReceiverId == receiverId) ||
                            (m.SenderId == receiverId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.Timestamp)
                .Select(m => new {
                    m.Id,
                    m.SenderId,
                    m.ReceiverId,
                    m.Content,
                    m.Timestamp,
                    m.ReplyToMessageId,
                    
                    ReplyToContent = _context.Messages
                        .Where(x => x.Id == m.ReplyToMessageId)
                        .Select(x => x.Content)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}