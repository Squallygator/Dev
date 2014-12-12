using System;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Text;
namespace ReorganizePhotoInDirectories
{
	internal class Program
	{
		private static void Main(string[] args)
		{
			string text = Directory.GetCurrentDirectory();
			string destinationPath = Directory.GetCurrentDirectory();
			if (args != null && args.Length > 0)
			{
				text = args[0];
				destinationPath = ((args.Length > 1) ? args[1] : text);
			}
			DirectoryInfo directoryInfo = new DirectoryInfo(text);
			var dirs = directoryInfo.GetDirectories();
			if (dirs!=null && dirs.Length>0){
				foreach (var dir in dirs) {
					if(dir.Name.Contains("-"))
						dir.MoveTo(dir.Name.Replace('-','_'));
				}
			}
			
			//Program.RegroupPhotos(text, destinationPath);
		}
		
		private static void RegroupPhotos(string source, string destinationPath)
		{
			if (!Directory.Exists(destinationPath))
			{
				throw new FileNotFoundException();
			}
			DirectoryInfo directoryInfo = new DirectoryInfo(source);
			FileInfo[] files = directoryInfo.GetFiles("*.jpg", SearchOption.TopDirectoryOnly);
			for (int i = 0; i < files.Length; i++)
			{
				FileInfo fileInfo = files[i];
				string name = fileInfo.Name;
				string fullName = fileInfo.FullName;
				if (fullName == null)
				{
					Console.WriteLine("--> FileNotFoundException");
				}
				else
				{
					Console.WriteLine(fullName);
					DateTime d;
					if (DateTime.TryParseExact(Path.GetFileNameWithoutExtension(name), "yyyy-MM-dd HH.mm.ss", null, DateTimeStyles.None, out d))
					{
						Program.MoveFile(d, destinationPath, name, fullName, true);
					}
					else
					{
						if (Program.TryExtractExifDateTaken(fullName, out d))
						{
							Program.MoveFile(d, destinationPath, name, fullName, false);
						}
					}
				}
			}
			Console.ReadKey();
		}
		public static bool TryExtractExifDateTaken(string FilePath, out DateTime d)
		{
			string text = null;
			using (Image image = new Bitmap(FilePath))
			{
				PropertyItem propertyItem = image.GetPropertyItem(306);
				text = Encoding.UTF8.GetString(propertyItem.Value).Trim();
				string str = text.Substring(text.IndexOf(" "), text.Length - text.IndexOf(" "));
				string text2 = text.Substring(0, 10);
				text2 = text2.Replace(":", "-");
				text = text2 + str;
			}
			return DateTime.TryParse(text, out d);
		}
		public static void MoveFile(DateTime d, string destinationPath, string currentFileName, string currentFilePath, bool ReuseExistingFileName)
		{
			string text = string.Format("{0:yyyy}\\{0:MM} {0:MMMM}\\{0:yyyy-MM-dd}", d);
			if (!ReuseExistingFileName)
			{
				currentFileName = string.Format("{0:yyyy}-{0:MM}-{0:dd} {0:HH}.{0:mm}.{0:ss} {2}{1}", d, currentFileName, (ConfigurationManager.AppSettings["DestRenamePrefix"] + " ") ?? "");
			}
			DirectoryInfo directoryInfo = new DirectoryInfo(Path.Combine(destinationPath, text));
			if (directoryInfo == null || !directoryInfo.Exists)
			{
				DirectoryInfo directoryInfo2 = new DirectoryInfo(destinationPath);
				directoryInfo = directoryInfo2.CreateSubdirectory(text);
			}
			Console.WriteLine("-->" + Path.Combine(directoryInfo.FullName, currentFileName));
			try
			{
				File.Move(currentFilePath, Path.Combine(directoryInfo.FullName, currentFileName));
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.ToString());
			}
		}
	}
}
