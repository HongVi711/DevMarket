const express = require('express');
const app = express();

// Middleware cho phép xử lý dữ liệu dạng JSON
app.use(express.json());

// Route cơ bản
app.get('/', (req, res) => {
    res.send('Hello from app.js!');
});

// Export app ra ngoài
module.exports = app;
