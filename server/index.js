require('dotenv').config();
const cors = require("cors");
const express = require('express')
const authRouter = require('./routes/auth.js');
const app = express()

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

const port = process.env.PORT || 5000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))