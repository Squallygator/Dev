/*
 * Created by SharpDevelop.
 * User: Pascal
 * Date: 25/09/2014
 * Time: 21:26
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Linq.Expressions;
using NUnit.Framework;
using MusicCleanerService;
namespace MusicCleanerServiceTests
{
	/// <summary>
	/// Description of MyClass.
	/// </summary>
	[TestFixture]
	[Category("MusicTagService")]
	public class MusicTagServiceTest
	{
		
		[Test]
		[TestCase(null, null)]
		[TestCase("", null)]
		[TestCase("truc", null)]
		[TestCase("truc", "")]
		[Category("MusicTagService.ExtractPathFromTag")]
		public void TestThatExtractPathFromTagThrowsArgumentNullException(string filepath, string destinationDirectoryPath){
			var sut = new MusicTagService();
			Assert.Throws<ArgumentNullException>(()=>sut.ExtractPathFromTag(null, null));
		}
	}
}