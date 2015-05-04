using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcSandBox.Areas.Invoicing.Controllers
{
    public class CreateController : Controller
    {
        // GET: Facturation/Create
        public ActionResult Index()
        {
            ViewBag.Title = "Maquette Creation Facture";
            return View();
        }
    }
}