let vendas = [
  {
    id: 1,
    id_moto: 1,
    login_vendedor: "vend1",
    login_cliente: "cliente1",
    data: "2025-12-07",
    valor: 35000,
    forma_pagamento: "CREDITO",
  },
];

const listarVendas = (req, res) => {
  res.status(200).json({ vendas });
};

const criarVenda = (req, res) => {
  const {
    id,
    id_moto,
    login_vendedor,
    login_cliente,
    data,
    valor,
    forma_pagamento,
  } = req.body;

  if (
    !id ||
    !id_moto ||
    !login_vendedor ||
    !login_cliente ||
    !data ||
    valor == null ||
    !forma_pagamento
  ) {
    return res.status(400).json({
      message:
        "id, id_moto, login_vendedor, login_cliente, data, valor e forma_pagamento são obrigatórios.",
    });
  }

  const existente = vendas.find(v => v.id === Number(id));
  if (existente) {
    return res.status(409).json({ message: "ID de venda já existe." });
  }

  const nova = {
    id: Number(id),
    id_moto: Number(id_moto),
    login_vendedor,
    login_cliente,
    data, // por enquanto string
    valor: Number(valor),
    forma_pagamento,
  };

  vendas.push(nova);
  res.status(201).json(nova);
};

const obterVendaPorId = (req, res) => {
  const id = Number(req.params.id);
  const venda = vendas.find(v => v.id === id);
  if (!venda) return res.status(404).json({ message: "Venda não encontrada." });
  res.status(200).json(venda);
};

const atualizarVenda = (req, res) => {
  const id = Number(req.params.id);
  const index = vendas.findIndex(v => v.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Venda não encontrada." });

  const {
    id_moto,
    login_vendedor,
    login_cliente,
    data,
    valor,
    forma_pagamento,
  } = req.body;

  vendas[index] = {
    ...vendas[index],
    id_moto: id_moto != null ? Number(id_moto) : vendas[index].id_moto,
    login_vendedor: login_vendedor ?? vendas[index].login_vendedor,
    login_cliente: login_cliente ?? vendas[index].login_cliente,
    data: data ?? vendas[index].data,
    valor: valor != null ? Number(valor) : vendas[index].valor,
    forma_pagamento: forma_pagamento ?? vendas[index].forma_pagamento,
  };

  res.status(200).json(vendas[index]);
};

const deletarVenda = (req, res) => {
  const id = Number(req.params.id);
  const index = vendas.findIndex(v => v.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Venda não encontrada." });
  const removida = vendas.splice(index, 1)[0];
  res.status(200).json({ message: "Venda removida.", venda: removida });
};

module.exports = {
  listarVendas,
  criarVenda,
  obterVendaPorId,
  atualizarVenda,
  deletarVenda,
};
