import { createServer, IncomingMessage, ServerResponse } from 'http';
import app from '../server/app'; // Express application

/**
 * Vercel serverless function entry point.
 * Vercel passes raw Node.js `IncomingMessage` and `ServerResponse`
 * objects. We forward them to the existing Express app.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const server = createServer(app);
    // Emit the request so Express can handle it.
    server.emit('request', req, res);
}
