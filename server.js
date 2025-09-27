import http from 'http';
import app from './app/app.js';

// 1. Get the port from the environment variable (Render sets this) 
// or default to a common development port (e.g., 5000) for local testing.
const PORT = process.env.PORT || 5000; 

const server = http.createServer(app)

// 2. Pass the PORT variable to server.listen() and use the actual 
//    variable in the log message inside the callback function.
server.listen(PORT, () => {
    console.log(`Server is connected and is running on port ${PORT}`);
});