using System.Web.Mvc;
using System.Web.Routing;
using SimpleInjector;
using SurfCalendar.Business;
using System.Reflection;
using SimpleInjector.Integration.Web.Mvc;
using SimpleInjector.Integration.Web;

namespace SurfCalendar
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            var container = new Container();
            container.Options.DefaultScopedLifestyle = new WebRequestLifestyle();
            container.Register<ISpotBusiness, SpotBusiness>(Lifestyle.Scoped);
            
            // This is an extension method from the integration package.
            container.RegisterMvcControllers(Assembly.GetExecutingAssembly());

            // This is an extension method from the integration package as well.
            container.RegisterMvcIntegratedFilterProvider();

            container.Verify();

            DependencyResolver.SetResolver(new SimpleInjectorDependencyResolver(container));
        }
    }
}
