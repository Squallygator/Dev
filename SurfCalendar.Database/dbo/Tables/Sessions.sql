CREATE TABLE [dbo].[Sessions] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
	[Date] DATETIME NOT NULL,
    [SpotId] INT NOT NULL, 
    CONSTRAINT [PK_dbo.Sessions] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_SessionSpot] FOREIGN KEY ([SpotId]) REFERENCES dbo.Spots(Id),
	INDEX [IX_SessionSpot] (SpotId asc)
);

