using System;
using System.IO;
using System.Linq;
namespace ReorganizeMusicDirectory
{
	internal class Program
	{
		private static void Main(string[] args)
		{
			string text = args.ElementAtOrDefault(0);
			string destinationPath = args.ElementAtOrDefault(1) ?? text;
			Program.RecusiveFolderMove(text, destinationPath);
		}
		private static void RecusiveFolderMove(string source, string destinationPath)
		{
			DirectoryInfo directoryInfo = new DirectoryInfo(source);
			DirectoryInfo[] directories = directoryInfo.GetDirectories();
			for (int i = 0; i < directories.Length; i++)
			{
				DirectoryInfo directoryInfo2 = directories[i];
				if (directoryInfo2.Name.Length != 1)
				{
					string path = Program.CreateFirstLetterSubDir(destinationPath, directoryInfo2);
					directoryInfo2.MoveTo(Path.Combine(path, directoryInfo2.Name));
				}
			}
		}
		private static string CreateFirstLetterSubDir(string destinationPath, DirectoryInfo currentdir)
		{
			if (currentdir == null)
			{
				throw new FileNotFoundException();
			}
			DirectoryInfo directoryInfo = new DirectoryInfo(destinationPath);
			if (directoryInfo == null)
			{
				throw new FileNotFoundException();
			}
			string text = currentdir.Name[0].ToString();
			string text2 = Path.Combine(destinationPath, text);
			DirectoryInfo directoryInfo2 = new DirectoryInfo(text2);
			if (directoryInfo2 == null || !directoryInfo2.Exists)
			{
				directoryInfo2 = directoryInfo.CreateSubdirectory(text);
			}
			return text2;
		}
	}
}
