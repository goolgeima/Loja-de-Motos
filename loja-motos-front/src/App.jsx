import { useState, useEffect } from "react";
import { MotosPage } from "./MotosPage";
import { ClientesPage } from "./ClientesPage";
import { VendedoresPage } from "./VendedoresPage";
import { VendasPage } from "./VendasPage";
import { AlterarSenhaPage } from "./AlterarSenhaPage";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [pagina, setPagina] = useState("motos");

  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
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
      setPagina("motos");
    } catch {
      alert("Erro ao conectar com o servidor");
    }
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem("usuario");
    setPagina("motos");
    setLogin("");
    setSenha("");
  }

  if (!usuario) {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            placeholder="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            placeholder="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  function renderPagina() {
    if (pagina === "motos") return <MotosPage usuario={usuario} />;
    if (pagina === "clientes") return <ClientesPage usuario={usuario} />;
    if (pagina === "vendedores") return <VendedoresPage usuario={usuario} />;
    if (pagina === "vendas") return <VendasPage usuario={usuario} />;
    if (pagina === "senha") return <AlterarSenhaPage usuario={usuario} />;
    return null;
  }

  return (
    <div>
      <p>
        Logado como: {usuario.login} ({usuario.perfil})
      </p>
      <button onClick={logout}>Sair</button>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <button onClick={() => setPagina("motos")}>Motos</button>
        <button onClick={() => setPagina("clientes")}>Clientes</button>
        <button onClick={() => setPagina("vendedores")}>Vendedores</button>
        <button onClick={() => setPagina("vendas")}>Vendas</button>
        <button onClick={() => setPagina("senha")}>Alterar senha</button>
      </div>

      {renderPagina()}
    </div>
  );
}

export default App;
