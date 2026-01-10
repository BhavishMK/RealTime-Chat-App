using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Tetherfi.Chat.Service.Data;
using Tetherfi.Chat.Service.Models;

namespace Tetherfi.Chat.Service.Hubs
{
    [Authorize] // Requires JWT
    public class ChatHub : Hub
    {
        private readonly ChatDbContext _context;
        
        private static readonly Dictionary<string, string> UserConnections = new();

        public ChatHub(ChatDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                UserConnections[userId] = Context.ConnectionId;
                await UpdateUserStatus("Available");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                UserConnections.Remove(userId);
                await UpdateUserStatus("Offline");
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task UpdateStatus(string status)
        {
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await Clients.All.SendAsync("UserStatusChanged", userId, status);
        }

        private async Task UpdateUserStatus(string status)
        {
            var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int userId))
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.Status = status;
                    await _context.SaveChangesAsync();
                    // Broadcast status change to all connected clients
                    await Clients.All.SendAsync("UserStatusChanged", userId, status);
                }
            }
        }

        public async Task SendPrivateMessage(int receiverId, string content, int? replyToId)
        {
            var senderIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(senderIdStr, out int senderId)) return;

            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                ReplyToMessageId = replyToId,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var response = new
            {
                message.Id,
                message.SenderId,
                message.ReceiverId,
                message.Content,
                message.Timestamp,
                message.ReplyToMessageId
            };

            // Send to Receiver
            if (UserConnections.TryGetValue(receiverId.ToString(), out var receiverConnId))
            {
                await Clients.Client(receiverConnId).SendAsync("ReceiveMessage", response);
            }

            // Send to Sender (for multi-tab sync)
            await Clients.Caller.SendAsync("ReceiveMessage", response);
        }
    }
}