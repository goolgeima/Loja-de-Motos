const express = require("express");
const {
  listarMotos,
  criarMoto,
  obterMotoPorId,
  atualizarMoto,
  deletarMoto,
} = require("../controllers/moto-controller");
const somenteVendedores = require("../middlewares/auth-admin");

const router = express.Router();

// qualquer um 
router.get("/", listarMotos);
router.get("/:id", obterMotoPorId);

// só vendedores
router.post("/", somenteVendedores, criarMoto);
router.put("/:id", somenteVendedores, atualizarMoto);
router.delete("/:id", somenteVendedores, deletarMoto);

module.exports = router;
