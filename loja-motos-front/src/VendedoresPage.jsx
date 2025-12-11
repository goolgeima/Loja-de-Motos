import { useEffect, useState } from "react";

export function VendedoresPage({ usuario }) {
  const [vendedores, setVendedores] = useState([]);

  const [id, setId] = useState("");
  const [login, setLogin] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    async function carregar() {
      const resp = await fetch("http://localhost:3000/vendedores");
      const data = await resp.json();
      setVendedores(data.vendedores || data);
    }
    carregar();
  }, []);

  function limparForm() {
    setId("");
    setLogin("");
    setNome("");
    setTelefone("");
    setEditandoId(null);
  }

  function carregarParaEdicao(v) {
    setEditandoId(v.id);
    setId(v.id);
    setLogin(v.login);
    setNome(v.nome);
    setTelefone(v.telefone);
  }

  async function handleSalvarVendedor(e) {
    e.preventDefault();

    const vendedor = {
      id: Number(id),
      login,
      nome,
      telefone,
    };

    const url = editandoId
      ? `http://localhost:3000/vendedores/${editandoId}`
      : "http://localhost:3000/vendedores";
    const method = editandoId ? "PUT" : "POST";

    const resp = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        perfil: usuario.perfil,
      },
      body: JSON.stringify(vendedor),
    });

    if (!resp.ok) {
      alert("Erro ao salvar vendedor");
      return;
    }

    const salvo = await resp.json();

    if (editandoId) {
      setVendedores((prev) =>
        prev.map((v) => (v.id === editandoId ? salvo : v))
      );
    } else {
      setVendedores((prev) => [...prev, salvo]);
    }

    limparForm();
  }

  async function handleExcluirVendedor(idVendedor) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const resp = await fetch(
      `http://localhost:3000/vendedores/${idVendedor}`,
      {
        method: "DELETE",
        headers: { perfil: usuario.perfil },
      }
    );

    if (!resp.ok) {
      alert("Erro ao excluir vendedor");
      return;
    }

    setVendedores((prev) => prev.filter((v) => v.id !== idVendedor));
    if (editandoId === idVendedor) limparForm();
  }

  return (
    <div>
      <h2>Vendedores</h2>

      <ul>
        {vendedores.map((v) => (
          <li key={v.id}>
            {v.id} - {v.nome} ({v.login}) - Tel: {v.telefone}
            {usuario.perfil === "VENDEDOR" && (
              <>
                {" "}
                <button onClick={() => carregarParaEdicao(v)}>Editar</button>
                <button onClick={() => handleExcluirVendedor(v.id)}>
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {usuario.perfil === "VENDEDOR" && (
        <div>
          <h3>{editandoId ? "Editar vendedor" : "Cadastrar novo vendedor"}</h3>
          <form onSubmit={handleSalvarVendedor}>
            <input
              placeholder="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!!editandoId}
            />
            <input
              placeholder="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              placeholder="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              placeholder="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            <button type="submit">
              {editandoId ? "Atualizar vendedor" : "Salvar vendedor"}
            </button>
            {editandoId && (
              <button type="button" onClick={limparForm}>
                Cancelar edição
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
