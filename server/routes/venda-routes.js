const express = require("express");
const {
  listarVendas,
  criarVenda,
  obterVendaPorId,
  atualizarVenda,
  deletarVenda,
} = require("../controllers/venda-controller");

const router = express.Router();

// base: /vendas
router.get("/", listarVendas);        // GET /vendas
router.post("/", criarVenda);        // POST /vendas
router.get("/:id", obterVendaPorId); // GET /vendas/:id
router.put("/:id", atualizarVenda);  // PUT /vendas/:id
router.delete("/:id", deletarVenda); // DELETE /vendas/:id

module.exports = router;
