using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SurfCalendar.Models
{
    public class Session
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int SpotId { get; set; }
    }
}