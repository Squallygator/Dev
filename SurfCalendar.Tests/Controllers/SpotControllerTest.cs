using Microsoft.VisualStudio.TestTools.UnitTesting;
using SurfCalendar.Controllers;
using Moq;
using SurfCalendar.Business;
using SurfCalendar.Models;
using System.Web.Mvc;
using System.Collections.Generic;

namespace SurfCalendar.Tests.Controllers
{
    [TestClass]
    public class SpotControllerTest
    {
        private Mock<ISpotBusiness> spotBusinessMock;
        private SpotsController classToTest;

        [TestInitialize]
        public void BeforeEach()
        {
            spotBusinessMock = new Mock<ISpotBusiness>();
            classToTest = new SpotsController(spotBusinessMock.Object);
        }

        [TestMethod]
        public void SpotController_Index_Get()
        {
            // Arrange 
            spotBusinessMock
                .Setup(_ => _.GetById(It.IsAny<int>()))
                .Returns<int>(id => new Spot { Id = id });
            const int GivenId = 1;

            // Act
            var actual = classToTest.Index(GivenId) as ViewResult;

            // Assert
            Assert.IsNotNull(actual);
            Assert.IsNotNull(actual.Model);
            var model = actual.Model as Spot;
            Assert.IsNotNull(model);
            Assert.AreEqual(GivenId, model.Id);
        }

        [TestMethod]
        public void SpotController_List_Get()
        {
            // Arrange 
            var expected = new List<Spot>
            {
                new Spot { Id=1 },
                new Spot { Id=1 }
            };

            spotBusinessMock
                .Setup(_ => _.GetList())
                .Returns(expected);

            // Act
            var actual = classToTest.List() as ViewResult;

            // Assert
            Assert.IsNotNull(actual);
            Assert.AreEqual(expected, actual.Model);
        }

    }
}
