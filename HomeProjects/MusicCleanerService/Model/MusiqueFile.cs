
using System;
using System.Collections.Generic;
using System.IO;
using TagLib.Matroska;

namespace MusicCleanerService.Model
{
	/// <summary>
	/// Description of MusiqueFile.
	/// </summary>
	public class MusiqueFile
	{
		public string FilePath { get; set; }
		public string FileName { get; set; }
		public string Directory { get; set; }
		public string Title { get; set; }
		public uint Track { get; set; }
		public uint Year { get; set; }
		public uint Disc { get; set; }
		public string Album { get; set; }
		public string AlbumArtist { get; set; }
	}
	
	public static class MusiqueFileFactory
	{
		public static MusiqueFile Create(string filePath, TagLib.File file)
		{
			var tag = file.Tag;
			return new MusiqueFile {
				FilePath = filePath,
				FileName = Path.GetFileName(filePath),
				Directory = Path.GetDirectoryName(filePath),
				Title = tag.Title,
				Track = tag.Track,
				Year = tag.Year,
				Disc = tag.Disc,
				Album = tag.Album,
				AlbumArtist = tag.FirstAlbumArtist ?? tag.FirstPerformer ?? tag.Album,
			};
		}
	}
	
	public class MusiqueFileFormatter
	{
		private  readonly Dictionary<string, Func<MusiqueFile, string>> recognizedPatternWords = new Dictionary<string, Func<MusiqueFile, string>> {
			{ "{FileName}", _ => _.FileName },
			{ "{Title}", _ => _.Title },
			{ "{Track}", _ => _.Track.ToString() },
			{ "{Year}", _ => _.Year.ToString() },
			{ "{Disc}", _ => _.Disc.ToString() },
			{ "{Album}", _ => _.Album }, 
			{ "{AlbumArtist}", _ => _.AlbumArtist },
		};
		
		readonly MusiqueFile musiqueFile;

		public MusiqueFileFormatter(MusiqueFile musiqueFile)
		{
			this.musiqueFile = musiqueFile;
		}
		
		public static string Format(MusiqueFile musiqueFile, string pattern)
		{
			var formatter = new MusiqueFileFormatter(musiqueFile);
			return formatter.Format(pattern);
		}
		
		public string Format(string pattern)
		{
			if (string.IsNullOrEmpty(pattern))
				throw new ArgumentNullException("pattern");
			var result = pattern;
			foreach (var key in recognizedPatternWords.Keys) {
				if (result.Contains(key))
					result = result.Replace(key, recognizedPatternWords[key](musiqueFile));
			}
			return result;
		}
	}
}
