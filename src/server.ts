
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { setupSocket, notifyClients } from './socket';
import { setupSqlNotifier } from './sql-notifier';

dotenv.config();

const app = express();
const server = http.createServer(app);

setupSocket(server);

// Avvio notifiche SQL
setupSqlNotifier(notifyClients)
  .then(() => console.log('✅ SqlDependency attivato'))
  .catch((err) => console.error('❌ Errore setup SqlNotifier:', err));

app.get('/', (req, res) => {
  res.send('✅ Backend attivo con SqlDependency');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server ascolta sulla porta ${PORT}`);
});
