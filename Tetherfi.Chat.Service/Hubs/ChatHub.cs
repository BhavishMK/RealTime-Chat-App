using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Tetherfi.Chat.Service.Data;
using Tetherfi.Chat.Service.Models;

namespace Tetherfi.Chat.Service.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ChatDbContext _context;

        // Static dictionary to map UserID -> ConnectionID
        private static readonly Dictionary<string, string> UserConnections = new();

        public ChatHub(ChatDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            // Fix CS8602: Use null-conditional and check for null
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != null)
            {
                lock (UserConnections)
                {
                    UserConnections[userId] = Context.ConnectionId;
                }
                await UpdateUserStatus("Available");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != null)
            {
                lock (UserConnections)
                {
                    UserConnections.Remove(userId);
                }
                await UpdateUserStatus("Offline");
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task UpdateStatus(string status)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Clients.All.SendAsync("UserStatusChanged", userId, status);
            }
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
                    // Broadcast to everyone that this user's status changed
                    await Clients.All.SendAsync("UserStatusChanged", userId.ToString(), status);
                }
            }
        }

        public async Task SendPrivateMessage(int receiverId, string content, int? replyToId)
        {
            var senderIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (senderIdStr == null || !int.TryParse(senderIdStr, out int senderId)) return;

            // 1. Save to Database
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

            // 2. Prepare the Response Object
            var response = new
            {
                id = message.Id,
                senderId = message.SenderId,
                receiverId = message.ReceiverId,
                content = message.Content,
                timestamp = message.Timestamp,
                replyToId = message.ReplyToMessageId
            };

            // 3. Send to Receiver (Logic Fix: Use Client() for specific connection)
            string? receiverConnId;
            lock (UserConnections)
            {
                UserConnections.TryGetValue(receiverId.ToString(), out receiverConnId);
            }

            if (!string.IsNullOrEmpty(receiverConnId))
            {
                // Send only to the specific connection ID found in our dictionary
                await Clients.Client(receiverConnId).SendAsync("ReceiveMessage", response);
            }

            // 4. Send back to the Sender (to update their own UI/other tabs)
            await Clients.Caller.SendAsync("ReceiveMessage", response);
        }
    }
}