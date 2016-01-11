using SurfCalendar.Business;
using SurfCalendar.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SurfCalendar.Controllers
{
    public class SpotsController : Controller
    {
        private readonly ISpotBusiness spotBusiness;

        public SpotsController(ISpotBusiness spotBusiness)
        {
            this.spotBusiness = spotBusiness;
        }

        // GET: Spots
        public ActionResult Index(int id)
        {
            var model = spotBusiness.GetById(id);
            return View(model);
        }

        public ViewResult List()
        {
            var model = spotBusiness.GetList();
            return View(model);
        }
    }
}