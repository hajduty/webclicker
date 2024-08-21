using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;

        private readonly AppDbContext _context;

        public AuthController(TokenService tokenService)
        {
            _tokenService = tokenService;
            _context = new AppDbContext();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = AuthenticateUser(request.Email, request.Password);

            if (user == null)
                return Unauthorized();

            var token = _tokenService.GenerateToken(user);

            user.Password = "";

            return Ok(new { user, token });
        }

        [HttpPost("register")]
        public IActionResult register([FromBody] LoginRequest request)
        {
            var user = RegisterUser(request.Email, request.Password);

            if (user == null)
                return Unauthorized();

            var token = _tokenService.GenerateToken(user);

            user.Password = "";

            return Ok(new { user, token });
        }

        private User AuthenticateUser(string email, string password)
        {
            if (email == "" || password == "")
                return null;

            var user = _context.Users
                .FirstOrDefault(b => b.Email.Equals(email) && b.Password.Equals(password));

            if (user == null)
                return null;

            return user;
        }

        [Authorize]
        [HttpPost("updateHwid")]
        public IActionResult UpdateHwid([FromBody] VarRequest request)
        {
            if (HttpContext.Request.Headers.TryGetValue("Authorization", out var jwtToken))
            {
                var cleanedToken = jwtToken.ToString().Replace("Bearer ", "");

                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(cleanedToken);
                var hwid = jwtSecurityToken.Claims.First(claim => claim.Type == "hwid").Value;
                var email = jwtSecurityToken.Claims.First(claim => claim.Type == "email").Value;

                string hwidValue = "hwid1234";

                if (request._value is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.String)
                {
                    hwidValue = jsonElement.GetString()!;
                }
                else
                {
                    hwidValue = request._value.ToString()!;
                }

                var user = UpdateUserHwid(email, hwidValue);

                if (user == null)
                    return Unauthorized();

                user.Password = "";

                return Ok("Updated hwid");
            }
            return Unauthorized();
        }

        private User RegisterUser(string email, string password)
        {
            if (email == "" || password == "")
                return null;

            var user = _context.Users
                .FirstOrDefault(b => b.Email.Equals(email) && b.Password.Equals(password));

            if (_context.Users.Any(u => u.Email.Equals(email)))
            {
                return null;
            }

            User _user = new User { Email = email, Password = password, Username = email, Activated = false, Hwid = "nohwid" };

            _context.Users.Add(_user);
            _context.SaveChanges();

            return _user;
        }

        private User UpdateUserHwid(string email, string value)
        {
            var user = _context.Users.FirstOrDefault(b => b.Email.Equals(email));
            if (user == null)
            {
                return null;
            }

            user.Hwid = value;
            _context.Users.Update(user);
            _context.SaveChanges();
            Console.WriteLine($"Updated hwid '{value}' for user " + email);

            return user;
        }
    }
}