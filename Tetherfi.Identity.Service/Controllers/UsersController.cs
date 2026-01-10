using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Tetherfi.Identity.Service.Data;
using Tetherfi.Identity.Service.Models;

namespace Tetherfi.Identity.Service.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IdentityDbContext _context;

        public UsersController(IdentityDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // Get the ID of the logged-in user from JWT claims
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Fetch all users except "me"
            var users = await _context.Users
                .Where(u => u.Id != currentUserId)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.Status
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
