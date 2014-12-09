using System;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
namespace ReorganizeMusicDirectory
{
	public sealed class Arguments
	{
		private StringDictionary Parameters;
		public string this[string Param]
		{
			get
			{
				return this.Parameters[Param];
			}
		}
		public Arguments(string[] Args)
		{
			this.Parameters = new StringDictionary();
			Regex regex = new Regex("^-{1,2}|^/|=|:", RegexOptions.IgnoreCase | RegexOptions.Compiled);
			Regex regex2 = new Regex("^['\"]?(.*?)['\"]?$", RegexOptions.IgnoreCase | RegexOptions.Compiled);
			string text = null;
			for (int i = 0; i < Args.Length; i++)
			{
				string input = Args[i];
				string[] array = regex.Split(input, 3);
				switch (array.Length)
				{
				case 1:
					if (text != null)
					{
						if (!this.Parameters.ContainsKey(text))
						{
							array[0] = regex2.Replace(array[0], "$1");
							this.Parameters.Add(text, array[0]);
						}
						text = null;
					}
					break;
				case 2:
					if (text != null)
					{
						if (!this.Parameters.ContainsKey(text))
						{
							this.Parameters.Add(text, "true");
						}
					}
					text = array[1];
					break;
				case 3:
					if (text != null)
					{
						if (!this.Parameters.ContainsKey(text))
						{
							this.Parameters.Add(text, "true");
						}
					}
					text = array[1];
					if (!this.Parameters.ContainsKey(text))
					{
						array[2] = regex2.Replace(array[2], "$1");
						this.Parameters.Add(text, array[2]);
					}
					text = null;
					break;
				}
			}
			if (text != null)
			{
				if (!this.Parameters.ContainsKey(text))
				{
					this.Parameters.Add(text, "true");
				}
			}
		}
	}
}
