using System.Collections.Generic;
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

    }
}