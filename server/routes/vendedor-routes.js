// vendedor-routes.js
const express = require("express");
const router = express.Router();
const {
  listarVendedores,
  criarVendedor,
  atualizarVendedor,
  deletarVendedor,
  atualizarSenhaVendedor,
} = require("../controllers/vendedor-controller");

// CRUD normal
router.get("/vendedores", listarVendedores);
router.post("/vendedores", criarVendedor);
router.put("/vendedores/:id", atualizarVendedor);
router.delete("/vendedores/:id", deletarVendedor);

// NOVO: alteração de senha por login
router.put("/vendedores/:login/senha", atualizarSenhaVendedor);

module.exports = router;
