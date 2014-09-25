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
using NUnit.Framework.Constraints;
using TagLib;
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
		[Category("MusicTagService.ExtractPathFromTag")]
		[TestCase(null, null)]
		[TestCase("", null)]
		[TestCase("truc", null)]
		[TestCase("truc", "")]
		public void TestThatExtractPathFromTagThrowsArgumentNullException(string filepath, string destinationDirectoryPath){
			var sut = new MusicTagService();
			Assert.Throws<ArgumentNullException>(()=>sut.ExtractPathFromTag(filepath, destinationDirectoryPath));
		}
		[Test]
		[Category("MusicTagService.ExtractPathFromTag")]
		[TestCase(@"D:\Musique\_Elliot&Anatole_\Black M - Sur Ma Route.mp3", @"d:\Musique\Tri", "{Title}.mp3")]
		public void TestThatExtractPathFromTagReturnAGoodPath(string filepath, string destinationDirectoryPath, string pattern){
			var sut = new MusicTagService("");
            var f = File.Create(filepath);
            Tag tag = f.Tag;
            var result = sut.ExtractPathFromTag(tag, pattern, destinationDirectoryPath);
			Assert.True(result.StartsWith(destinationDirectoryPath));
		}
	}
}