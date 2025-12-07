const express = require("express");
const {
  listarClientes,
  criarCliente,
  obterClientePorId,
  atualizarCliente,
  deletarCliente,
} = require("../controllers/cliente-controller");

const router = express.Router();

router.get("/", listarClientes);        
router.post("/", criarCliente);         
router.get("/:id", obterClientePorId);  
router.put("/:id", atualizarCliente);   
router.delete("/:id", deletarCliente);  
module.exports = router;
