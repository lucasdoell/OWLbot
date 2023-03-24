import express from "express";
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`OWLbot server listening on port ${port}`);
});
