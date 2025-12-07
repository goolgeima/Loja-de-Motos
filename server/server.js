const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clienteRoutes = require("./routes/cliente-routes");
const motoRoutes = require("./routes/moto-routes");
const usuarioRoutes = require("./routes/usuario-routes");
const vendedorRoutes = require("./routes/vendedor-routes");
const vendaRoutes = require("./routes/venda-routes");

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

//usar json pras requisicoes
app.use(express.json());

// rotas das entidades cadastradas
app.use("/motos", motoRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/clientes", clienteRoutes);
app.use("/vendedores", vendedorRoutes);
app.use("/vendas", vendaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
