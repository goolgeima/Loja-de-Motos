let motos = [
  {
    id: 1,
    marca: "Kawasaki",
    modelo: "Versys X-300 Tourer",
    ano: 2023,
    cilindrada: 300,
    cavalos: 40,
    estilo: "Trail",
    quilometragem: 31210,
    preco: 34000,
  },
];

const listarMotos = (req, res) => {
  res.status(200).json({ motos });
};

const criarMoto = (req, res) => {
  const {
    id,
    marca,
    modelo,
    ano,
    cilindrada,
    cavalos,
    estilo,
    quilometragem,
    preco,
  } = req.body;

  if (
    !id ||
    !marca ||
    !modelo ||
    !ano ||
    !cilindrada ||
    !cavalos ||
    !estilo ||
    quilometragem == null ||
    preco == null
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos da moto são obrigatórios." });
  }

  const existente = motos.find((m) => m.id === Number(id));
  if (existente) {
    return res.status(409).json({ message: "ID de moto já existe." });
  }

  const nova = {
    id: Number(id),
    marca,
    modelo,
    ano: Number(ano),
    cilindrada: Number(cilindrada),
    cavalos: Number(cavalos),
    estilo,
    quilometragem: Number(quilometragem),
    preco: Number(preco),
  };

  motos.push(nova);
  res.status(201).json(nova);
};

// procura a moto pelo id
const obterMotoPorId = (req, res) => {
  const id = Number(req.params.id);
  const moto = motos.find((m) => m.id === id);
  if (!moto) return res.status(404).json({ message: "Moto não encontrada." });
  res.status(200).json(moto);
};

// ATUALIZAR moto
const atualizarMoto = (req, res) => {
  const id = Number(req.params.id);
  const index = motos.findIndex((m) => m.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Moto não encontrada." });

  const {
    marca,
    modelo,
    ano,
    cilindrada,
    cavalos,
    estilo,
    quilometragem,
    preco,
  } = req.body;

  motos[index] = {
    ...motos[index],
    marca: marca ?? motos[index].marca,
    modelo: modelo ?? motos[index].modelo,
    ano: ano != null ? Number(ano) : motos[index].ano,
    cilindrada: cilindrada != null ? Number(cilindrada) : motos[index].cilindrada,
    cavalos: cavalos != null ? Number(cavalos) : motos[index].cavalos,
    estilo: estilo ?? motos[index].estilo,
    quilometragem:
      quilometragem != null ? Number(quilometragem) : motos[index].quilometragem,
    preco: preco != null ? Number(preco) : motos[index].preco,
  };

  res.status(200).json(motos[index]);
};

const deletarMoto = (req, res) => {
  const id = Number(req.params.id);
  const index = motos.findIndex((m) => m.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Moto não encontrada." });

  const removida = motos.splice(index, 1)[0];
  res.status(200).json({ message: "Moto removida.", moto: removida });
};

module.exports = {
  listarMotos,
  criarMoto,
  obterMotoPorId,
  atualizarMoto,
  deletarMoto,
};
