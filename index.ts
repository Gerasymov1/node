import express from "express";

const app = express();

app.use(express.json());

const PORT = 5001;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
