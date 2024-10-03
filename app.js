const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

var cors = require("cors");
app.use(cors());

const PORT = process.env.PORT;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

const corsOptions = {
  origin: ALLOWED_ORIGIN,
  optionsSuccessStatus: 200,
};

console.log({ PORT });
console.log({ ALLOWED_ORIGIN });

async function startServer() {
  try {
    app.use(express.json());

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
}

startServer();

module.exports = app;
