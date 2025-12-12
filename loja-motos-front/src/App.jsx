import { useState } from "react";
import "./App.css";
import { MotosPage } from "./pages/MotosPage";
import { ClientesPage } from "./pages/ClientesPage";
import { VendedoresPage } from "./pages/VendedoresPage";
import { VendasPage } from "./pages/VendasPage";
import { UsuariosPage } from "./pages/UsuariosPage";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState("motos");

  async function handleLogin(e) {
    e.preventDefault();
    const login = e.target.login.value;
    const senha = e.target.senha.value;

    const resp = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha }),
    });

    if (!resp.ok) {
      alert("Login inválido");
      return;
    }

    const data = await resp.json();
    setUsuario({ login: data.login, perfil: data.perfil });
    setPagina("motos");
  }

  function handleLogout() {
    setUsuario(null);
    setPagina("motos");
  }

  if (!usuario) {
    return (
      <div className="app">
        <div className="topbar card">
          <h1>Loja de Motos</h1>
        </div>
        <div className="content card login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input name="login" placeholder="Login" />
            <input name="senha" type="password" placeholder="Senha" />
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  let conteudo;
  if (pagina === "motos") conteudo = <MotosPage usuario={usuario} />;
  else if (pagina === "vendas") conteudo = <VendasPage usuario={usuario} />;
  else if (usuario.perfil === "VENDEDOR") {
    if (pagina === "clientes") conteudo = <ClientesPage usuario={usuario} />;
    else if (pagina === "vendedores")
      conteudo = <VendedoresPage usuario={usuario} />;
    else if (pagina === "usuarios")
      conteudo = <UsuariosPage usuario={usuario} />;
    else conteudo = <MotosPage usuario={usuario} />;
  } else {
    conteudo = <MotosPage usuario={usuario} />;
  }

  return (
    <div className="app">
      <div className="topbar card">
        <div>
          <h1>Loja de Motos</h1>
          <p>
            Logado como {usuario.login} ({usuario.perfil})
          </p>
        </div>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <div className="menu">
        <button className="menu-btn" onClick={() => setPagina("motos")}>
          Motos
        </button>
        <button className="menu-btn" onClick={() => setPagina("vendas")}>
          Vendas
        </button>

        {usuario.perfil === "VENDEDOR" && (
          <>
            <button
              className="menu-btn"
              onClick={() => setPagina("clientes")}
            >
              Clientes
            </button>
            <button
              className="menu-btn"
              onClick={() => setPagina("vendedores")}
            >
              Vendedores
            </button>
            <button
              className="menu-btn"
              onClick={() => setPagina("usuarios")}
            >
              Usuários
            </button>
          </>
        )}
      </div>

      <div className="content card">{conteudo}</div>
    </div>
  );
}
