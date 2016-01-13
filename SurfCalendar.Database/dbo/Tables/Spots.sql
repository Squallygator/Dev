CREATE TABLE [dbo].[Spots] (
    [Id]   INT            IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.Spots] PRIMARY KEY CLUSTERED ([Id] ASC)
);

