// Array em memória
let usuarios = [
  { login: "vendedor", senha: "123", perfil: "VENDEDOR", motoFavorita: "CB 500F" },
];

// LISTAR todos
const listarUsuarios = (req, res) => {
  res.status(200).json({ usuarios });
};

// CRIAR
const criarUsuario = (req, res) => {
  const { login, senha, perfil, motoFavorita } = req.body;

  if (!login || !senha || !perfil) {
    return res
      .status(400)
      .json({ message: "login, senha e perfil são obrigatórios." });
  }

  const existente = usuarios.find(u => u.login === login);
  if (existente) {
    return res.status(409).json({ message: "Login já existe." });
  }

  const novo = { login, senha, perfil, motoFavorita: motoFavorita || "" };
  usuarios.push(novo);
  res.status(201).json(novo);
};

// OBTER por login
const obterUsuarioPorLogin = (req, res) => {
  const { login } = req.params;
  const usuario = usuarios.find(u => u.login === login);
  if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });
  res.status(200).json(usuario);
};

// ATUALIZAR
const atualizarUsuario = (req, res) => {
  const { login } = req.params;
  const index = usuarios.findIndex(u => u.login === login);
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  const { senha, perfil, motoFavorita } = req.body;

  usuarios[index] = {
    ...usuarios[index],
    senha: senha ?? usuarios[index].senha,
    perfil: perfil ?? usuarios[index].perfil,
    motoFavorita: motoFavorita ?? usuarios[index].motoFavorita,
  };

  res.status(200).json(usuarios[index]);
};

// DELETAR
const deletarUsuario = (req, res) => {
  const { login } = req.params;
  const index = usuarios.findIndex(u => u.login === login);
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  const removido = usuarios.splice(index, 1)[0];
  res.status(200).json({ message: "Usuário removido.", usuario: removido });
};

const login = (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ message: "login e senha são obrigatórios." });
  }

  const usuario = usuarios.find(u => u.login === login && u.senha === senha);
  if (!usuario) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  //vou gerar um token/JWT; por enquanto só devolve dados básicos
  res.status(200).json({
    message: "Login realizado com sucesso.",
    login: usuario.login,
    perfil: usuario.perfil,
    motoFavorita: usuario.motoFavorita,
  });
};


module.exports = {
  listarUsuarios,
  criarUsuario,
  obterUsuarioPorLogin,
  atualizarUsuario,
  deletarUsuario,
  login,
};
