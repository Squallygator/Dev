using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace ReorganizeMusicDirectory
{
    class Program
    {
        static void Main(string[] args)
        {
            string sourcePath = args.ElementAtOrDefault(0);
            string destinationPath = args.ElementAtOrDefault(1) ?? sourcePath;
            RecusiveFolderMove(sourcePath, destinationPath);
        }
        
        private static void RecusiveFolderMove(string source, string destinationPath)
        {
            DirectoryInfo sourceDi = new DirectoryInfo(source);
            
            var dirs = sourceDi.GetDirectories();
            for (int i = 0; i < dirs.Length; i++)
            {
                DirectoryInfo currentdir = dirs[i];
                if (currentdir.Name.Length == 1) continue;
                string newdestinationPath = CreateFirstLetterSubDir(destinationPath, currentdir);
                currentdir.MoveTo(Path.Combine(newdestinationPath, currentdir.Name));
            }
        }
        private static string CreateFirstLetterSubDir(string destinationPath, DirectoryInfo currentdir)
        {
            if (currentdir == null) throw new FileNotFoundException();
            DirectoryInfo destDir = new DirectoryInfo(destinationPath);
            if (destDir == null) throw new FileNotFoundException();
            string FirstLetter = currentdir.Name[0].ToString().ToUpper();
            string newdestinationPath = Path.Combine(destinationPath, FirstLetter );
            DirectoryInfo newDir = new DirectoryInfo(newdestinationPath);
            if (newDir == null ||!newDir.Exists ) newDir = destDir.CreateSubdirectory(FirstLetter);
            return newdestinationPath;
        }
    }
}