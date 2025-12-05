function somenteVendedores(req, res, next) {
  const perfil = req.header("perfil"); // virá do front

  if (perfil !== "VENDEDOR") {
    return res.status(403).json({ message: "Acesso permitido só para vendedores." });
  }

  next();
}

module.exports = somenteVendedores;
