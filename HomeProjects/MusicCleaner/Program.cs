/*
 * Created by SharpDevelop.
 * User: Pascal
 * Date: 20/09/2014
 * Time: 14:06
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.IO;
using System.Linq;
using TagLib;
using TagLib.NonContainer;

namespace MusicCleaner
{
    class Program
    {
        public static void Main(string[] args)
		{
			Console.WriteLine("Hello World!");
			
			var text = args.ElementAtOrDefault(0);
            var service = new MusicCleanerService.MusicTagService(@"{AlbumArtist}\{Year} {Album}\{Track} {Title}.mp3");
            var result = service.ExtractPathFromTag(text, @"d:\musique");
			Console.WriteLine(text +" -> " + result);
			Console.Write("Press any key to continue . . . ");
			Console.ReadKey(true);
		}
        //		private static void RecusiveFolderMove(string source, string destinationPath)
        //		{
        //			var directoryInfo = new DirectoryInfo(source);
        //			var directories = directoryInfo.GetDirectories();
        //			for (int i = 0; i < directories.Length; i++)
        //			{
        //				var directoryInfo2 = directories[i];
        //				if (directoryInfo2.Name.Length != 1)
        //				{
        //					string path = Program.CreateFirstLetterSubDir(destinationPath, directoryInfo2);
        //					directoryInfo2.MoveTo(Path.Combine(path, directoryInfo2.Name));
        //				}
        //			}
        //		}
        //		private static string CreateFirstLetterSubDir(string destinationPath, DirectoryInfo currentdir)
        //		{
        //			if (currentdir == null)
        //				throw new FileNotFoundException();
        //			var directoryInfo = new DirectoryInfo(destinationPath);
        //			if (directoryInfo == null)
        //				throw new FileNotFoundException();
        //			var text = currentdir.Name[0].ToString();
        //			var text2 = Path.Combine(destinationPath, text);
        //			var directoryInfo2 = new DirectoryInfo(text2);
        //			if (directoryInfo2 == null || !directoryInfo2.Exists)
        //			{
        //				directoryInfo2 = directoryInfo.CreateSubdirectory(text);
        //			}
        //			return text2;
        //		}
    }
}