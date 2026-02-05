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
        private readonly ILogger<MessagesController> _logger;

        public MessagesController(ChatDbContext context, ILogger<MessagesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("history/{receiverId}")]
        public async Task<IActionResult> GetChatHistory(int receiverId)
        {
            try
            {
                // 1. Safe Claim Extraction
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                 ?? User.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    _logger.LogWarning("User ID claim not found in token.");
                    return Unauthorized("User ID not found in token.");
                }

                int currentUserId = int.Parse(userIdClaim);
                _logger.LogInformation($"Fetching history for User {currentUserId} and Colleague {receiverId}");

                // 2. Optimized Query
                var messages = await _context.Messages
                    .Where(m => (m.SenderId == currentUserId && m.ReceiverId == receiverId) ||
                                (m.SenderId == receiverId && m.ReceiverId == currentUserId))
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new {
                        id = m.Id,
                        senderId = m.SenderId,
                        receiverId = m.ReceiverId,
                        content = m.Content,
                        timestamp = m.Timestamp,
                        replyToId = m.ReplyToMessageId,
                        // Get the content of the message being replied to
                        replyToContent = _context.Messages
                            .Where(x => x.Id == m.ReplyToMessageId)
                            .Select(x => x.Content)
                            .FirstOrDefault()
                    })
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching chat history");
                // Returning the error message helps you debug in the Network Tab
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}