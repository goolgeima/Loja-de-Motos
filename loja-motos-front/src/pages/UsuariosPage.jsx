import { useEffect, useState } from "react";
import "./UsuariosPage.css";

export function UsuariosPage({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);

  const [loginNovo, setLoginNovo] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("CLIENTE");
  const [motoFavorita, setMotoFavorita] = useState("");

  const [editandoLogin, setEditandoLogin] = useState(null);

  useEffect(() => {
    async function carregar() {
      const resp = await fetch("http://localhost:3000/usuarios");
      const data = await resp.json();
      setUsuarios(data.usuarios || data);
    }
    carregar();
  }, []);

  function limparForm() {
    setLoginNovo("");
    setSenha("");
    setPerfil("CLIENTE");
    setMotoFavorita("");
    setEditandoLogin(null);
  }

  function carregarParaEdicao(u) {
    setEditandoLogin(u.login);
    setLoginNovo(u.login); // login não muda, só exibido desabilitado
    setSenha("");
    setPerfil(u.perfil);
    setMotoFavorita(u.motoFavorita || "");
  }

  async function handleSalvarUsuario(e) {
    e.preventDefault();

    if (!editandoLogin) {
      // CRIAR
      if (!loginNovo || !senha || !perfil) {
        alert("Preencha login, senha e perfil.");
        return;
      }

      const novo = {
        login: loginNovo,
        senha,
        perfil,
        motoFavorita,
      };

      const resp = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          perfil: usuario.perfil,
        },
        body: JSON.stringify(novo),
      });

      if (!resp.ok) {
        alert("Erro ao criar usuário");
        return;
      }

      const criado = await resp.json();
      setUsuarios((prev) => [...prev, criado]);
      limparForm();
    } else {
      // ATUALIZAR (login é a chave na URL)
      const atualizacao = {
        // senha opcional: só troca se preencher
        senha: senha || undefined,
        perfil,
        motoFavorita,
      };

      const resp = await fetch(
        `http://localhost:3000/usuarios/${editandoLogin}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            perfil: usuario.perfil,
          },
          body: JSON.stringify(atualizacao),
        }
      );

      if (!resp.ok) {
        alert("Erro ao atualizar usuário");
        return;
      }

      const atualizado = await resp.json();
      setUsuarios((prev) =>
        prev.map((u) => (u.login === editandoLogin ? atualizado : u))
      );
      limparForm();
    }
  }

  async function handleExcluirUsuario(login) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    const resp = await fetch(`http://localhost:3000/usuarios/${login}`, {
      method: "DELETE",
      headers: {
        perfil: usuario.perfil,
      },
    });

    if (!resp.ok) {
      alert("Erro ao excluir usuário");
      return;
    }

    setUsuarios((prev) => prev.filter((u) => u.login !== login));
    if (editandoLogin === login) limparForm();
  }

  return (
    <div className="usuarios-root">
      <h2>Usuários</h2>

      <div className="usuarios-layout">
        <div className="usuarios-list">
          <ul>
            {usuarios.map((u) => (
              <li key={u.login}>
                <div className="usuario-info">
                  {u.login} - {u.perfil}{" "}
                  {u.motoFavorita && `- Moto favorita: ${u.motoFavorita}`}
                </div>
                <div className="usuario-actions">
                  <button onClick={() => carregarParaEdicao(u)}>Editar</button>
                  <button onClick={() => handleExcluirUsuario(u.login)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {usuario.perfil === "VENDEDOR" && (
          <div className="usuarios-form">
            <h3>
              {editandoLogin
                ? `Editar usuário (${editandoLogin})`
                : "Criar novo usuário"}
            </h3>
            <form onSubmit={handleSalvarUsuario}>
              <input
                placeholder="Login"
                value={loginNovo}
                onChange={(e) => setLoginNovo(e.target.value)}
                disabled={!!editandoLogin}
              />
              <input
                placeholder={
                  editandoLogin ? "Nova senha (opcional)" : "Senha"
                }
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
              >
                <option value="CLIENTE">CLIENTE</option>
                <option value="VENDEDOR">VENDEDOR</option>
              </select>
              <input
                placeholder="Moto favorita (opcional)"
                value={motoFavorita}
                onChange={(e) => setMotoFavorita(e.target.value)}
              />

              <button type="submit">
                {editandoLogin ? "Atualizar usuário" : "Salvar usuário"}
              </button>
              {editandoLogin && (
                <button type="button" onClick={limparForm}>
                  Cancelar edição
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
