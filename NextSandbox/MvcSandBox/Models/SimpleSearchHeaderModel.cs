using System.Collections.Generic;

namespace MvcSandBox.Models
{
    public class SimpleSearchHeaderModel
    {
        public string LibelleSeleteurRecherche { get; set; }

        public string LibelleBoutonRecherche { get; set; }

        public List<SimpleSearchModel> Recherches { get; set; }
    }
}