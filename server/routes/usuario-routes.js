const express = require("express");
const {
  listarUsuarios,
  criarUsuario,
  obterUsuarioPorLogin,
  atualizarUsuario,
  deletarUsuario,
  login,
} = require("../controllers/usuario-controller");

const router = express.Router();

// rota de login
router.post("/login", login);

// base: /usuarios
router.get("/", listarUsuarios);
router.post("/", criarUsuario);
router.get("/:login", obterUsuarioPorLogin);
router.put("/:login", atualizarUsuario);
router.delete("/:login", deletarUsuario);

module.exports = router;
