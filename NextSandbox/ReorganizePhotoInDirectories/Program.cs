using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Globalization;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
namespace ReorganizePhotoInDirectories
{
    class Program
    {
        static void Main(string[] args)
        {
            string sourcePath = Directory.GetCurrentDirectory(); ;
            string destinationPath = Directory.GetCurrentDirectory(); ;
            if (args != null && args.Length > 0)
            {
                sourcePath = args[0];
                destinationPath = (args.Length > 1) ? args[1] : sourcePath;
            }
            RegroupPhotos(sourcePath, destinationPath);
        }

        private static void RegroupPhotos(string source, string destinationPath)
        {
            if (!Directory.Exists(destinationPath)) throw new FileNotFoundException();
            DirectoryInfo sourceDi = new DirectoryInfo(source);
            var files = sourceDi.GetFiles("*.jpg", SearchOption.TopDirectoryOnly);
            sourceDi = null;
            for (int i = 0; i < files.Length; i++)
            {
                FileInfo currentFileInfo = files[i];
                string currentFileName = currentFileInfo.Name;
                string currentFilePath = currentFileInfo.FullName;
                currentFileInfo = null;
                if (currentFilePath == null)
                {
                    Console.WriteLine("--> FileNotFoundException");
                    continue;
                }
                Console.WriteLine(currentFilePath);
                DateTime d;
                //CultureInfo frFR = new CultureInfo("fr-FR"); 

                if (DateTime.TryParseExact(Path.GetFileNameWithoutExtension(currentFileName), "yyyy-MM-dd HH.mm.ss", null, DateTimeStyles.None, out d))
                {
                    MoveFile(d, destinationPath, currentFileName, currentFilePath, true);
                }
                else
                {
                    if (TryExtractExifDateTaken(currentFilePath, out d))
                    {
                        MoveFile(d, destinationPath, currentFileName, currentFilePath, false);
                    };
                }
            }
            Console.ReadKey();
        }
        public static bool TryExtractExifDateTaken(string FilePath, out DateTime d)
        {
            string sdate = null;
            using (Image theImage = new Bitmap(FilePath))
            {
                PropertyItem propItem = theImage.GetPropertyItem(306);//Property Item 306 corresponds to the Date Taken
                //Convert date taken metadata to a DateTime object
                sdate = Encoding.UTF8.GetString(propItem.Value).Trim();
                string secondhalf = sdate.Substring(sdate.IndexOf(" "), (sdate.Length - sdate.IndexOf(" ")));
                string firsthalf = sdate.Substring(0, 10);
                firsthalf = firsthalf.Replace(":", "-");
                sdate = firsthalf + secondhalf;
            }
            return (DateTime.TryParse(sdate, out d));
        }
        public static void MoveFile(DateTime d, string destinationPath, string currentFileName, string currentFilePath, bool ReuseExistingFileName)
        {
            string newdestinationPath = String.Format("{0:yyyy}\\{0:MM} {0:MMMM}\\{0:yyyy-MM-dd}", d);
            if (!ReuseExistingFileName) currentFileName = String.Format("{0:yyyy}-{0:MM}-{0:dd} {0:HH}.{0:mm}.{0:ss} {2}{1}", d, currentFileName, (ConfigurationManager.AppSettings["DestRenamePrefix"] + " ") ?? "");
            DirectoryInfo newDir = new DirectoryInfo(Path.Combine(destinationPath, newdestinationPath));
            if (newDir == null || !newDir.Exists)
            {
                DirectoryInfo destDir = new DirectoryInfo(destinationPath);
                newDir = destDir.CreateSubdirectory(newdestinationPath);
            }
            Console.WriteLine("-->" + Path.Combine(newDir.FullName, currentFileName));
            try
            {
                File.Move(currentFilePath, Path.Combine(newDir.FullName, currentFileName));
                //currentFileInfo.MoveTo(Path.Combine(newDir.FullName, currentFileName));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
