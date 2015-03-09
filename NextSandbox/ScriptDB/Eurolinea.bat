@echo off
set dbServer=BABEL\MSSQL2005DEV
set dbName=EurolineaFraPreProd
set dbUser=Eurolinea
set dbPass=3uR0l1ne4
ScriptDb.exe -con:server=%dbServer%;database=%dbName%;User=%dbUser%;Password=%dbPass% -outDir:%dbName% -d -v -p -TableOneFile -ScriptAsCreate -NoCollation -filename:-
pause