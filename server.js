require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/configs/database');

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
