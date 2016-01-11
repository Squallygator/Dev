using SurfCalendar.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace SurfCalendar.DataAccess
{
    public class SurfCalendarContext : DbContext
    {
        public DbSet<Spot> Spots { get; set; }
        public DbSet<Session> Sessions { get; set; }
    }
}