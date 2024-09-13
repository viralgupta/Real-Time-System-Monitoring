const express = require('express');


const app = express();

app.use(express.json());

app.post("/api/postData", (req, res) => {
  
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});