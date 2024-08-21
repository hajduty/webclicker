using backend.Models;
using System.Diagnostics.Eventing.Reader;
using System.Drawing;
using System.Reflection;
using System.Reflection.Metadata;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;

namespace backend.Services
{
    public class ConfigService
    {
        private readonly AppDbContext _context;

        public ConfigService(AppDbContext context)
        {
            _context = context;
        }

        public Config GetUserConfig(string hwid)
        {
            var user = _context.Users.FirstOrDefault(b => b.Hwid.Equals(hwid));

            if (user == null)
            {
                return new Config();
            }

            var config = _context.Configs.FirstOrDefault(b => b.Email.Equals(user.Email));

            if (config == null)
            {
                Config _config = new Config();
                _config.Email = user.Email;
                _context.Configs.Add(_config);
                Console.WriteLine("No config, creating a new one.");
                return _config;
            }

            Console.WriteLine("Config found!");

            return config;
        }

        public void UpdateConfigProperty(string hwid, VarRequest request)
        {
            var config = GetUserConfig(hwid);

            string key = request._key.ToString();

            if (config != null)
            {
                var property = typeof(Config).GetProperty(key);
                if (property != null)
                {
                    var valueType = property.PropertyType;
                    var valueString = request._value.ToString();

                    object convertedValue = null;

                    if (valueType == typeof(int))
                    {
                        int intValue;
                        if (int.TryParse(valueString, out intValue))
                        {
                            convertedValue = intValue;
                        }
                    }
                    else if (valueType == typeof(bool))
                    {
                        bool boolValue;
                        if (bool.TryParse(valueString, out boolValue))
                        {
                            convertedValue = boolValue;
                        }
                    }
                    else if (valueType == typeof(double))
                    {
                        double doubleValue;
                        if (double.TryParse(valueString, out doubleValue))
                        {
                            convertedValue = doubleValue;
                        }
                    }
                    else if (valueType == typeof(string))
                    {
                        convertedValue = valueString;
                    }
                    property.SetValue(config, convertedValue);
                }

                _context.SaveChanges();
                Console.WriteLine("Updated key:" + request._key + " for user with " + hwid);
            }
        }
    }
}