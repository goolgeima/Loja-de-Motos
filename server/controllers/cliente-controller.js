let clientes = [
  { id: 1, nome: "João", cpf: "11111111111", telefone: "11999999999" },
];

const listarClientes = (req, res) => {
  res.status(200).json({ clientes });
};

const criarCliente = (req, res) => {
  const { id, nome, cpf, telefone } = req.body;

  if (!id || !nome || !cpf || !telefone) {
    return res
      .status(400)
      .json({ message: "id, nome, cpf e telefone são obrigatórios." });
  }

  const existenteId = clientes.find((c) => c.id === Number(id));
  if (existenteId) {
    return res.status(409).json({ message: "ID de cliente já existe." });
  }

  const novo = {
    id: Number(id),
    nome,
    cpf,
    telefone,
  };

  clientes.push(novo);
  res.status(201).json(novo);
};

const obterClientePorId = (req, res) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente)
    return res.status(404).json({ message: "Cliente não encontrado." });
  res.status(200).json(cliente);
};

const atualizarCliente = (req, res) => {
  const id = Number(req.params.id);
  const index = clientes.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Cliente não encontrado." });
  }

  const { nome, cpf, telefone } = req.body;

  clientes[index] = {
    ...clientes[index],
    nome: nome ?? clientes[index].nome,
    cpf: cpf ?? clientes[index].cpf,
    telefone: telefone ?? clientes[index].telefone,
  };

  res.status(200).json(clientes[index]);
};

const deletarCliente = (req, res) => {
  const id = Number(req.params.id);
  const index = clientes.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Cliente não encontrado." });
  }
  const removido = clientes.splice(index, 1)[0];
  res.status(200).json({ message: "Cliente removido.", cliente: removido });
};

module.exports = {
  listarClientes,
  criarCliente,
  obterClientePorId,
  atualizarCliente,
  deletarCliente,
};
