const express = require('express');
// const connectDB = require('./config/db.js')
const dotenv = require('dotenv')
var cors = require('cors')

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
// connectDB()

app.use("/api/postdata/server", (req, res) => {
  console.log(req.body)
  res.json({ success: true })
})
app.use("/api/postdata/training", (req, res) => {
  console.log(req.body)
  res.json({ success: true })
})

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});