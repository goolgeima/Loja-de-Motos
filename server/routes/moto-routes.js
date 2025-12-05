const express = require("express");
const {
  listarMotos,
  criarMoto,
  obterMotoPorId,
  atualizarMoto,
  deletarMoto,
} = require("../controllers/moto-controller");

const router = express.Router();

// Base: /motos
router.get("/", listarMotos);        // GET /motos
router.post("/", criarMoto);         // POST /motos
router.get("/:id", obterMotoPorId);  // GET /motos/:id
router.put("/:id", atualizarMoto);   // PUT /motos/:id
router.delete("/:id", deletarMoto);  // DELETE /motos/:id

module.exports = router;
