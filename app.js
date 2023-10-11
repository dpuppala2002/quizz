const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');
const cors=require("cors");


const PORT = 3000;
app.use(cors());
const MONGODB_URL = 'mongodb://localhost:27017/your-database-name'; // Replace with your MongoDB connection URL

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const queryParams = parsedUrl.query;

  if (pathname === '/') {
    // Home Page
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page');
  } else if (pathname === '/login' && req.method === 'POST') {
    // Login Page
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const params = querystring.parse(body);
      const username = params.username;
      const password = params.password;

      // Connect to MongoDB
      const client = new MongoClient(MONGODB_URL, { useUnifiedTopology: true });

      try {
        await client.connect();
        const db = client.db();
        const usersCollection = db.collection('users');

        // Find the user by username and password
        const user = await usersCollection.findOne({ username, password });

        // Check if the user exists
        if (user) {
          res.writeHead(302, { 'Location': '/' });
          res.end();
        } else {
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          res.end('Unauthorized');
        }
      } finally {
        await client.close();
      }
    });
  } else {
    // Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
