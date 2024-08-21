namespace backend.Models
{
    public class VarRequest
    {
        public object _key { get; set; }
        public object _value { get; set; }
    }

    public class TcpRequest
    {
        public string? Type { get; set; }
        public object? Contents { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
