using System.Collections.Generic;
using System.IO;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using TagLib;
using System.Linq;
using MusicCleanerService.Model;

public class MusicIndexer
{
	readonly MongoClient client;

	readonly MongoServer server;

	readonly MongoDatabase database;
	
	MongoCollection<MusiqueFile> fileCollection;
	
	public MusicIndexer(string connectionString)
	{
		client = new MongoClient(connectionString);
		server = client.GetServer();
		server.Connect();
		database = server.GetDatabase("MusicFiles");
	}
	
	~MusicIndexer()
	{
		server.Disconnect();
	}
	
	public	void IndexBy(string path, IFileProvider fileProvider)
	{
		foreach (var file in fileProvider.GetFiles(path)) {
			Index(file);
		}
	}

	public void Index(string filePath)
	{
		var fileTag = TagLib.File.Create(filePath);
		var musicFile = MusiqueFileFactory.Create(filePath, fileTag);
		fileCollection = database.GetCollection<MusiqueFile>("files");
		var foundFile = fileCollection.FindOne(Query<MusiqueFile>.EQ(_ => _.FilePath, musicFile.FilePath));
		if (foundFile == null)
			fileCollection.Insert(musicFile);
	}
}

public interface IFileProvider
{
	IEnumerable<string> GetFiles(string path);
}

public class DirectoryFileProvider: IFileProvider
{
	public IEnumerable<string> GetFiles(string path)
	{
		return Directory.EnumerateFiles(Path.GetDirectoryName(path), "*.mp3", SearchOption.AllDirectories);
	}
}
