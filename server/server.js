const express = require("express");
const cors = require("cors");
require("dotenv").config();

const motoRoutes = require("./routes/moto-routes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// rotas de motos
app.use("/motos", motoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
