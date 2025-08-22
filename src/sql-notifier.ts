import { ConnectionPool } from 'mssql';
import { MssqlNotifier } from 'mssql-notifications';
import dbConfig from './config/db';

export const setupSqlNotifier = async (onChange: () => void) => {
  const pool = new ConnectionPool(dbConfig);

  await pool.connect();

  const notifier = new MssqlNotifier({
    connection: pool,
    query: `SELECT Id, PackageId FROM dbo.ExpectedPackages WHERE Reconciled = 0`
  });

  notifier.on('change', () => {
    console.log('📦 Cambiamento rilevato in ExpectedPackages!');
    onChange();
  });

  notifier.on('error', async (err) => {
    console.error('❌ Errore SQL Dependency:', err);
    await pool.close();
  });

  notifier.on('end', async () => {
    // Cleanup when notifier stops
    await pool.close();
  });

  notifier.start();
};
