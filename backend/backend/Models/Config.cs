using backend.Utils;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Config
    {
        [Key]
        public string Email { get; set; }
        public bool rightclickerEnabled { get; set; }
        public int rightJitter { get; set; }
        public int rightclickerCps { get; set; } = 13;
        public int rightclickerBind { get; set; } = 0;

        public bool leftclickerEnabled { get; set; }
        public int leftJitter { get; set; }
        public int leftclickerBind { get; set; } = 0;
        public double leftclickerCps { get; set; } = 12;
        public bool lockLeft { get; set; } = false;
        public bool breakBlocks { get; set; } = false;
        public bool onlyClickIngame { get; set; } = true;
        public bool clickInMenu { get; set; } = false;
        public bool allowEat { get; set; } = false;
        public bool shiftDisable { get; set; } = false;
        public int blockhitChance { get; set; } = 0;
        public string filename { get; set; } = "filename.dll";
    }
}
