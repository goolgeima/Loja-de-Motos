// cliente-controller.js
const { clientes } = require("../data/base"); // ou de onde você importa

const listarClientes = (req, res) => {
  res.json(clientes);
};

const criarCliente = (req, res) => {
  const { id, login, nome, cpf, telefone, senha } = req.body;

  if (!id || !login || !nome || !cpf || !telefone || !senha) {
    return res
      .status(400)
      .json({ message: "Todos os campos do cliente são obrigatórios." });
  }

  const existente = clientes.find((c) => c.id === Number(id));
  if (existente) {
    return res.status(409).json({ message: "ID de cliente já existe." });
  }

  const novo = {
    id: Number(id),
    login,
    nome,
    cpf,
    telefone,
    senha,
  };

  clientes.push(novo);
  res.status(201).json(novo);
};

const atualizarCliente = (req, res) => {
  const { id } = req.params;
  const { login, nome, cpf, telefone } = req.body;

  const cliente = clientes.find((c) => c.id === Number(id));
  if (!cliente) {
    return res.status(404).json({ message: "Cliente não encontrado." });
  }

  if (!login || !nome || !cpf || !telefone) {
    return res
      .status(400)
      .json({ message: "Todos os campos do cliente são obrigatórios." });
  }

  cliente.login = login;
  cliente.nome = nome;
  cliente.cpf = cpf;
  cliente.telefone = telefone;

  res.json(cliente);
};

const deletarCliente = (req, res) => {
  const { id } = req.params;

  const index = clientes.findIndex((c) => c.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ message: "Cliente não encontrado." });
  }

  clientes.splice(index, 1);
  res.status(204).send();
};

// NOVO: atualizar senha do cliente
const atualizarSenhaCliente = (req, res) => {
  const { login } = req.params;
  const { senhaAntiga, novaSenha } = req.body;

  if (!senhaAntiga || !novaSenha) {
    return res
      .status(400)
      .json({ message: "Senha antiga e nova senha são obrigatórias." });
  }

  const cliente = clientes.find((c) => c.login === login);
  if (!cliente) {
    return res.status(404).json({ message: "Cliente não encontrado." });
  }

  if (cliente.senha !== senhaAntiga) {
    return res.status(400).json({ message: "Senha antiga incorreta." });
  }

  cliente.senha = novaSenha;
  res.json({ message: "Senha atualizada com sucesso." });
};

module.exports = {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
  atualizarSenhaCliente,
};
