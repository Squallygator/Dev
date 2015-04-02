namespace MvcSandBox.Models
{
    public class DetailFacture
    {
        public string CodeContrat { get; set; }
        public long Identifiant { get; set; }
        public long FactureId { get; set; }
        public bool Editable { get; set; }
        public long? RegimeTvaId { get; set; }
    }
}