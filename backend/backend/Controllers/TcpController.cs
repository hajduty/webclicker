using backend.Models;
using backend.Services;
using backend.Services.TcpServerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TcpController : ControllerBase
    {
        private readonly TcpServer _tcpServer;
        private readonly AppDbContext _context;

        public TcpController(TcpServer tcpServer, AppDbContext appDbContext)
        {
            _tcpServer = tcpServer;
            _context = new AppDbContext();
        }

        [Authorize]
        [HttpPost("var")]
        public async Task<IActionResult> SendMessage([FromBody] VarRequest request)
        {
            if (HttpContext.Request.Headers.TryGetValue("Authorization", out var jwtToken))
            {
                var cleanedToken = jwtToken.ToString().Replace("Bearer ", "");

                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(cleanedToken);
                var hwid = jwtSecurityToken.Claims.First(claim => claim.Type == "hwid").Value;
                var email = jwtSecurityToken.Claims.First(claim => claim.Type == "email").Value;

                Console.WriteLine(email);

                var user = GetUser(email);

                if (user == null)
                {
                    return Unauthorized();
                }

                if (user.Activated && user != null)
                {
                    Console.WriteLine("User is authenticated. Forwarding TCP message " + user.Hwid);
                    var key = request._key;
                    var value = request._value;

                    await _tcpServer.SendVarUpdate(user.Hwid!, request);
                }
            }
            else
            {
                // Handle missing or invalid token
                return Unauthorized();
            }

            return Ok("Message sent to clients.");
        }

        [NonAction]
        public User GetUser(string email)
        {
            var user = _context.Users.FirstOrDefault(b => b.Email.Equals(email));

            if (user == null)
            {
                Console.WriteLine("Cant find user with email " + email);
                return null;
            }

            return user;
        }

        [Authorize]
        [HttpPost("status")]
        public Task<IActionResult> GetStatus()
        {
            if (HttpContext.Request.Headers.TryGetValue("Authorization", out var jwtToken))
            {
                var cleanedToken = jwtToken.ToString().Replace("Bearer ", "");

                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(cleanedToken);
                var hwid = jwtSecurityToken.Claims.First(claim => claim.Type == "hwid").Value;
                var email = jwtSecurityToken.Claims.First(claim => claim.Type == "email").Value;

                return Task.FromResult<IActionResult>(Ok(new { IsOnline = _tcpServer.UserOnline(hwid), IsAuthorized = GetUser(email)?.Activated ?? false }));
            }
            return Task.FromResult<IActionResult>(Unauthorized());
        }
    }
}