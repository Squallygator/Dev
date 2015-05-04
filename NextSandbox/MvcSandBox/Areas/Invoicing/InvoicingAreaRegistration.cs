using System.Web.Mvc;

namespace MvcSandBox.Areas.Invoicing
{
    public class InvoicingAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Invoicing";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Invoicing_default",
                "Invoicing/{controller}/{action}/{id}",
                new { area = "Invoicing", controller = "Create", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}