using System.Collections.Generic;

namespace SurfCalendar.DataAccess
{
    public interface ICRUDDataAccess<T>
    {
        T GetById(int id);

        List<T> GetList();

        void Create(T model);
    }
}