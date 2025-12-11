// cliente-routes.js
const express = require("express");
const router = express.Router();
const {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
  atualizarSenhaCliente,
} = require("../controllers/cliente-controller");

// CRUD normal
router.get("/clientes", listarClientes);
router.post("/clientes", criarCliente);
router.put("/clientes/:id", atualizarCliente);
router.delete("/clientes/:id", deletarCliente);

// NOVO: alteração de senha por login
router.put("/clientes/:login/senha", atualizarSenhaCliente);

module.exports = router;
