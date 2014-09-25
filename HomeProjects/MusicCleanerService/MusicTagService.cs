/*
 * Created by SharpDevelop.
 * User: Pascal
 * Date: 25/09/2014
 * Time: 21:11
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Collections.Generic;
using TagLib;

namespace MusicCleanerService
{
    /// <summary>
    /// Description of MyClass.
    /// </summary>
    public class MusicTagService
    {
        string Pattern;
        Dictionary<string, Func<Tag, string>> recognizedPatternWords = new Dictionary<string, Func<Tag, string>>{
            {"{Title}", _=>_.Title}
        };
        public MusicTagService()
        {
        }

        public MusicTagService(string pattern)
        {
            this.Pattern = pattern;
        }

        public string ExtractPathFromTag(string filepath, string destinationDirectoryPath)
        {
            if (string.IsNullOrEmpty(filepath))
                throw new ArgumentNullException("filepath");
            if (string.IsNullOrEmpty(destinationDirectoryPath))
                throw new ArgumentNullException("destinationDirectoryPath");
            var f = File.Create(filepath);
            Tag tag = f.Tag;
            //				Console.WriteLine("FileName : " + string.Join(",", f.Name));
            //				Console.WriteLine("Title : " + string.Join(",", tag.Title));
            //				Console.WriteLine("AlbumArtists : " + string.Join(",", tag.AlbumArtists));
            //				Console.WriteLine("Artists : " + string.Join(",", tag.Performers));
            //				Console.WriteLine("Album : " + tag.Album);
            //			}
            //			// var  destinationPath = args.ElementAtOrDefault(1) ?? text;
            //			// Program.RecusiveFolderMove(text, destinationPath);
            //			
            //			Console.Write("Press any key to continue . . . ");
            //			Console.ReadKey(true);
            return destinationDirectoryPath;
        }

        public string ExtractPathFromTag(Tag tag, string pattern, string destinationDirectoryPath)
        {
            if (string.IsNullOrEmpty(destinationDirectoryPath))
                throw new ArgumentNullException("destinationDirectoryPath");
            if (string.IsNullOrEmpty(destinationDirectoryPath))
                throw new ArgumentNullException("destinationDirectoryPath");
            if (string.IsNullOrEmpty(destinationDirectoryPath))
                throw new ArgumentNullException("destinationDirectoryPath");
            var result = destinationDirectoryPath.TrimEnd('\\')
                + "\\" +
                pattern.TrimStart('\\');

            foreach (var key in recognizedPatternWords.Keys)
            {
                if (result.Contains(key))
                    result.Replace(key, recognizedPatternWords[key](tag));
            }
            return result;
        }
    }
}