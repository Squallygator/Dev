using System;
using System.Collections.Generic;
using System.Linq;
using SurfCalendar.Models;

namespace SurfCalendar.DataAccess
{
    public class SpotDataAccess : ISpotDataAccess
    {
        public List<Spot> GetList()
        {
            using (var db = new SurfCalendarContext())
            {
                return db.Spots.ToList();
            }
        }

        public Spot GetById(int id)
        {
            using (var db = new SurfCalendarContext())
            {
                return db.Spots.FirstOrDefault(_ => _.Id == id);
            }
        }

        public void Create(Spot model)
        {
            using (var db = new SurfCalendarContext())
            {
                db.Spots.Add(model);
                db.SaveChanges();
            }
        }
    }
}