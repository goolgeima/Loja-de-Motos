// vendedor-controller.js
const { vendedores } = require("../data/base"); // ajuste o caminho

const listarVendedores = (req, res) => {
  res.json(vendedores);
};

const criarVendedor = (req, res) => {
  const { id, login, nome, telefone, senha } = req.body;

  if (!id || !login || !nome || !telefone || !senha) {
    return res
      .status(400)
      .json({ message: "Todos os campos do vendedor são obrigatórios." });
  }

  const existente = vendedores.find((v) => v.id === Number(id));
  if (existente) {
    return res.status(409).json({ message: "ID de vendedor já existe." });
  }

  const novo = {
    id: Number(id),
    login,
    nome,
    telefone,
    senha,
  };

  vendedores.push(novo);
  res.status(201).json(novo);
};

const atualizarVendedor = (req, res) => {
  const { id } = req.params;
  const { login, nome, telefone } = req.body;

  const vendedor = vendedores.find((v) => v.id === Number(id));
  if (!vendedor) {
    return res.status(404).json({ message: "Vendedor não encontrado." });
  }

  if (!login || !nome || !telefone) {
    return res
      .status(400)
      .json({ message: "Todos os campos do vendedor são obrigatórios." });
  }

  vendedor.login = login;
  vendedor.nome = nome;
  vendedor.telefone = telefone;

  res.json(vendedor);
};

const deletarVendedor = (req, res) => {
  const { id } = req.params;

  const index = vendedores.findIndex((v) => v.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ message: "Vendedor não encontrado." });
  }

  vendedores.splice(index, 1);
  res.status(204).send();
};

// NOVO: atualizar senha do vendedor
const atualizarSenhaVendedor = (req, res) => {
  const { login } = req.params;
  const { senhaAntiga, novaSenha } = req.body;

  if (!senhaAntiga || !novaSenha) {
    return res
      .status(400)
      .json({ message: "Senha antiga e nova senha são obrigatórias." });
  }

  const vendedor = vendedores.find((v) => v.login === login);
  if (!vendedor) {
    return res.status(404).json({ message: "Vendedor não encontrado." });
  }

  if (vendedor.senha !== senhaAntiga) {
    return res.status(400).json({ message: "Senha antiga incorreta." });
  }

  vendedor.senha = novaSenha;
  res.json({ message: "Senha atualizada com sucesso." });
};

module.exports = {
  listarVendedores,
  criarVendedor,
  atualizarVendedor,
  deletarVendedor,
  atualizarSenhaVendedor,
};
