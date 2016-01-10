using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SurfCalendar.Controllers
{
    public class SessionsController : Controller
    {
        // GET: Sessions
        public ActionResult Index()
        {
            return View();
        }
    }
}