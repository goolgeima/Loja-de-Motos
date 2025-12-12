let vendedores = [
  { id: 1, login: "vend1", nome: "Carlos", telefone: "11999990000" },
];

const listarVendedores = (req, res) => {
  res.status(200).json({ vendedores });
};

const criarVendedor = (req, res) => {
  const { id, login, nome, telefone } = req.body;
  if (!id || !login || !nome || !telefone) {
    return res
      .status(400)
      .json({ message: "id, login, nome e telefone são obrigatórios." });
  }

  const existenteId = vendedores.find(v => v.id === Number(id));
  if (existenteId) {
    return res.status(409).json({ message: "ID de vendedor já existe." });
  }
  const existenteLogin = vendedores.find(v => v.login === login);
  if (existenteLogin) {
    return res.status(409).json({ message: "Login de vendedor já existe." });
  }

  const novo = { id: Number(id), login, nome, telefone };
  vendedores.push(novo);
  res.status(201).json(novo);
};

const obterVendedorPorId = (req, res) => {
  const id = Number(req.params.id);
  const vendedor = vendedores.find(v => v.id === id);
  if (!vendedor)
    return res.status(404).json({ message: "Vendedor não encontrado." });
  res.status(200).json(vendedor);
};

const atualizarVendedor = (req, res) => {
  const id = Number(req.params.id);
  const index = vendedores.findIndex(v => v.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Vendedor não encontrado." });

  const { login, nome, telefone } = req.body;
  vendedores[index] = {
    ...vendedores[index],
    login: login ?? vendedores[index].login,
    nome: nome ?? vendedores[index].nome,
    telefone: telefone ?? vendedores[index].telefone,
  };
  res.status(200).json(vendedores[index]);
};

const deletarVendedor = (req, res) => {
  const id = Number(req.params.id);
  const index = vendedores.findIndex(v => v.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Vendedor não encontrado." });
  const removido = vendedores.splice(index, 1)[0];
  res.status(200).json({ message: "Vendedor removido.", vendedor: removido });
};

module.exports = {
  listarVendedores,
  criarVendedor,
  obterVendedorPorId,
  atualizarVendedor,
  deletarVendedor,
};
