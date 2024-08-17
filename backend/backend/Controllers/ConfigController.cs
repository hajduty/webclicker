using backend.Models;
using backend.Services;
using backend.Services.TcpServerApi.Services;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly ConfigService _configService;

        public ConfigController(ConfigService configService)
        {
            _configService = configService;
        }

        [Authorize]
        [HttpGet("getConfig")]
        public async Task<IActionResult> GetConfig()
        {
            if (HttpContext.Request.Headers.TryGetValue("Authorization", out var jwtToken))
            {
                var cleanedToken = jwtToken.ToString().Replace("Bearer ", "");

                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(cleanedToken);
                var hwid = jwtSecurityToken.Claims.First(claim => claim.Type == "hwid").Value;

                Config config = _configService.GetUserConfig(hwid);

                return Ok(config);
            }
            return Unauthorized();
        }

        [Authorize]
        [HttpPost("updateConfig")]
        public async Task<IActionResult> UpdateConfig([FromBody] VarRequest request)
        {
            if (HttpContext.Request.Headers.TryGetValue("Authorization", out var jwtToken))
            {
                var cleanedToken = jwtToken.ToString().Replace("Bearer ", "");

                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(cleanedToken);
                var hwid = jwtSecurityToken.Claims.First(claim => claim.Type == "hwid").Value;

                var key = request._key;
                var value = request._value;

                _configService.UpdateConfigProperty(hwid, request);

                return Ok();
            }
            return Unauthorized();
        }
    }
}