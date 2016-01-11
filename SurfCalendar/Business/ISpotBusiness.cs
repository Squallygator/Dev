using SurfCalendar.Models;
using System.Collections.Generic;

namespace SurfCalendar.Business
{
    public interface ISpotBusiness
    {
        Spot GetById(int id);

        List<Spot> GetList();

        void Create(Spot spot);
    }
}
