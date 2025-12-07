import { useState, useEffect } from "react";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

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
    } catch (err) {
      alert("Erro ao conectar com o servidor");
    }
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem("usuario");
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

  return (
    <div>
      <p>
        Logado como: {usuario.login} ({usuario.perfil})
      </p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
const resp = await fetch("http://localhost:3000/motos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    perfil: usuario.perfil, // aqui vai "VENDEDOR"
  },
  body: JSON.stringify(novaMoto),
});

export default App;
