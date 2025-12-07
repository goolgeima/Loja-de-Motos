const express = require("express");
const {
  listarVendedores,
  criarVendedor,
  obterVendedorPorId,
  atualizarVendedor,
  deletarVendedor,
} = require("../controllers/vendedor-controller");

const router = express.Router();


router.get("/", listarVendedores);
router.post("/", criarVendedor);
router.get("/:id", obterVendedorPorId);
router.put("/:id", atualizarVendedor);
router.delete("/:id", deletarVendedor);

module.exports = router;
