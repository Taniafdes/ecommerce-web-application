import http from 'http';
import app from './app/app.js';

const PORT = process.env.PORT || 700
const server = http.createServer(app)
server.listen(PORT, console.log(`Server is connect and is running on ${700}`))