using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Hwid { get; set; } = null;
        public bool Activated { get; set; } = false;
    }
}
