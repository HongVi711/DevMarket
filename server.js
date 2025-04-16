const app = require('./src/app');
const port = process.env.PORT || 3000;
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello from server.js!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
