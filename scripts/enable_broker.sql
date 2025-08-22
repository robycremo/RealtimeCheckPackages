USE MASTER;
GO
DECLARE @DatabaseName NVARCHAR(128) = N'TEST';
DECLARE @IsBrokerEnabled BIT;

SELECT @IsBrokerEnabled = is_broker_enabled
FROM sys.databases
WHERE name = @DatabaseName;

IF @IsBrokerEnabled = 1
BEGIN
    PRINT '✅ Service Broker already enabled.';
END
ELSE
BEGIN
    PRINT '⚠️ Service Broker not enabled. Enabling...';
    EXEC('
        ALTER DATABASE [' + @DatabaseName + '] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        ALTER DATABASE [' + @DatabaseName + '] SET ENABLE_BROKER;
        ALTER DATABASE [' + @DatabaseName + '] SET MULTI_USER;
    ');
    PRINT '✅ Service Broker successfully enabled.';
END
