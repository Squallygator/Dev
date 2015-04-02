using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using MvcSandBox.Models;

namespace MvcSandBox.Controllers
{
    public class DefaultController : Controller
    {
        //
        // GET: /Default/

        public ActionResult Index()
        {
            var model = new SimpleSearchHeaderModel
            {
                LibelleSeleteurRecherche = "Type de Recherche",
                LibelleBoutonRecherche = "Rechercher",
                Recherches = new List<SimpleSearchModel>
                {
                    new SimpleSearchModel
                    {
                        Code = "Nom",
                        Libelle = "Nom Utilisateur",
                        InitFunction = "$.SimpleSearch.Nom.Init"
                    },
                    new SimpleSearchModel()
                    {
                        Code = "Prenom",
                        Libelle = "Prénom Utilisateur",
                        InitFunction = "$.SimpleSearch.Prenom.Init"
                    },
                    new SimpleSearchModel()
                    {
                        Code = "Login",
                        Libelle = "Login Utilisateur",
                        InitFunction = "$.SimpleSearch.Login.Init"
                    }
                }
            };
            return View(model);
        }

        public ActionResult Tests()
        {
            return View();
        }

        public ActionResult DasChange()
        {
            var model = new DetailFacture
            {
                CodeContrat = "GM_BEL",
                Editable = true,
                Identifiant = 123456L,
                FactureId = 456789L
            };
            RegisterRegimeTva();
            return View(model);
        }

        [HttpGet]
        public ActionResult GetFactureTvaDetails(string codeContrat, long detailId, long factureId,
            long? regimeTvaId, bool editable)
        {
            var model = new DetailFacture
            {
                CodeContrat = codeContrat,
                Editable = editable,
                Identifiant = detailId,
                FactureId = factureId,
                RegimeTvaId = regimeTvaId
            };
            RegisterRegimeTva();
            return PartialView("GetFactureTvaDetails", model);
        }

        private void RegisterRegimeTva()
        {
            ViewBag.RegimeTvaList = new List<SelectListItem>()
            {
                new SelectListItem()
                {
                    Disabled = true,
                    Value = "",
                    Text = "Inconnu"
                },
                new SelectListItem()
                {
                    Value = "0",
                    Text = "TTC"
                },
                new SelectListItem()
                {
                    Value = "2",
                    Text = "HT"
                },
            };
        }
    }
}