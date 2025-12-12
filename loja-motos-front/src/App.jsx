import { useState, useEffect } from "react";
import { MotosPage } from "./MotosPage";
import { ClientesPage } from "./ClientesPage";
import { VendedoresPage } from "./VendedoresPage";
import { VendasPage } from "./VendasPage";
import "./App.css";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [pagina, setPagina] = useState(null); // nenhuma aba selecionada

  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    if (!login || !senha) {
      alert("Preencha login e senha.");
      return;
    }

    try {
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
      const info = { login: data.login, perfil: data.perfil };
      setUsuario(info);
      localStorage.setItem("usuario", JSON.stringify(info));
      setPagina(null); // começa sem página selecionada
    } catch {
      alert("Erro ao conectar com o servidor");
    }
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem("usuario");
    setPagina(null);
    setLogin("");
    setSenha("");
  }

  function renderPagina() {
    if (pagina === "motos") return <MotosPage usuario={usuario} />;
    if (pagina === "clientes") return <ClientesPage usuario={usuario} />;
    if (pagina === "vendedores") return <VendedoresPage usuario={usuario} />;
    if (pagina === "vendas") return <VendasPage usuario={usuario} />;
    return null; // nenhuma aba selecionada
  }

  if (!usuario) {
    return (
      <div className="login-page">
        <form className="card login-card" onSubmit={handleLogin}>
          <h1>Loja de Motos</h1>
          <p className="login-subtitle">Acesse o painel</p>
          <input
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="logo">Loja de Motos</span>
        </div>
        <div className="topbar-right">
          <span className="user-info">
            {usuario.login} ({usuario.perfil})
          </span>
          <button className="btn btn-danger" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <nav className="menu">
        <button
          className={pagina === "motos" ? "menu-btn active" : "menu-btn"}
          onClick={() =>
            setPagina((atual) => (atual === "motos" ? null : "motos"))
          }
        >
          Motos
        </button>
        <button
          className={pagina === "clientes" ? "menu-btn active" : "menu-btn"}
          onClick={() =>
            setPagina((atual) => (atual === "clientes" ? null : "clientes"))
          }
        >
          Clientes
        </button>
        <button
          className={pagina === "vendedores" ? "menu-btn active" : "menu-btn"}
          onClick={() =>
            setPagina((atual) =>
              atual === "vendedores" ? null : "vendedores"
            )
          }
        >
          Vendedores
        </button>
        <button
          className={pagina === "vendas" ? "menu-btn active" : "menu-btn"}
          onClick={() =>
            setPagina((atual) => (atual === "vendas" ? null : "vendas"))
          }
        >
          Vendas
        </button>
      </nav>

      <main className="content">{renderPagina()}</main>
    </div>
  );
}

export default App;
