import dotenv from 'dotenv';
import app from './app';
import { closeInactiveSessions } from './services/chat.service.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
const INACTIVITY_MINUTES = 5;
const INACTIVITY_JOB_INTERVAL_MS = 60 * 1000; // every 1 minute

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const inactivityInterval = setInterval(async () => {
  try {
    const closed = await closeInactiveSessions(INACTIVITY_MINUTES);
    if (closed > 0) {
      console.log(`Closed ${closed} session(s) due to ${INACTIVITY_MINUTES} min inactivity`);
    }
  } catch (err) {
    console.error('Inactivity close job error:', err);
  }
}, INACTIVITY_JOB_INTERVAL_MS);

process.on('SIGTERM', () => {
  clearInterval(inactivityInterval);
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
