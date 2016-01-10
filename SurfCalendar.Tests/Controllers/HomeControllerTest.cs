using Microsoft.VisualStudio.TestTools.UnitTesting;
using SurfCalendar.Controllers;
using System.Web.Mvc;

namespace SurfCalendar.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void Index()
        {
            // Arrange
            HomeController controller = new HomeController();

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
        }
    }
}
