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
using System.IO;
using MongoDB.Driver;
using TagLib;

namespace MusicCleanerService
{
	/// <summary>
	/// Description of MyClass.
	/// </summary>
	public class MusicTagService
	{
		string Pattern;
		private  readonly Dictionary<string, Func<Tag, string>> recognizedPatternWords = new Dictionary<string, Func<Tag, string>> {
			{ "{Title}", _ => _.Title },
			{ "{Track}", _ => _.Track.ToString() },
			{ "{Year}", _ => _.Year.ToString() },
			{ "{Disc}", _ => _.Disc.ToString() },
			{ "{Album}", _ => _.Album }, { "{AlbumArtist}", _ => {
					var artiste = _.FirstAlbumArtist;
					if (string.IsNullOrEmpty(artiste))
						artiste = _.FirstPerformer;
					return artiste;
				}
			},
		};

		private readonly MongoClient client;

		public MusicTagService()
		{
			const string connectionString = "mongodb://localhost";
			client = new MongoClient(connectionString);
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
			var f = TagLib.File.Create(filepath);
			Tag tag = f.Tag;
			return ExtractPathFromTag(tag, this.Pattern, destinationDirectoryPath);
		}

		public string ExtractPathFromTag(Tag tag, string pattern, string destinationDirectoryPath)
		{
			if (tag == null)
				throw new ArgumentNullException("tag");
			if (string.IsNullOrEmpty(pattern))
				throw new ArgumentNullException("pattern");
			if (string.IsNullOrEmpty(destinationDirectoryPath))
				throw new ArgumentNullException("destinationDirectoryPath");

			var result = Path.Combine(destinationDirectoryPath, pattern);
			foreach (var key in recognizedPatternWords.Keys) {
				if (result.Contains(key))
					result = result.Replace(key, recognizedPatternWords[key](tag));
			}
			return result;
		}
	}
}