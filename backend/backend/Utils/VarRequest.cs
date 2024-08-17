namespace backend.Utils
{
    public class VarRequest
    {
        public object _key { get; set; }
        public object _value { get; set; }
    }

    public class Request
    {
        public string? Type { get; set; }
        public object? Contents { get; set; }
    }
}
