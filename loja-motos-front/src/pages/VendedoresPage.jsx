import { useEffect, useState } from "react";
import "./VendedoresPage.css";

export function VendedoresPage({ usuario }) {
  const [vendedores, setVendedores] = useState([]);

  const [id, setId] = useState("");
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
    setNome("");
    setTelefone("");
    setEditandoId(null);
  }

  function carregarParaEdicao(v) {
    setEditandoId(v.id);
    setId(v.id);
    setNome(v.nome);
    setTelefone(v.telefone);
  }

  async function handleSalvarVendedor(e) {
    e.preventDefault();

    const idNum = Number(id);
    if (!id || isNaN(idNum) || idNum <= 0) {
      alert("Informe um ID válido.");
      return;
    }
    if (!nome) {
      alert("Preencha o nome.");
      return;
    }

    const vendedor = {
      id: idNum,
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
        headers: {
          perfil: usuario.perfil,
        },
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
    <div className="vendedores-root">
      <h2>Vendedores</h2>

      <div className="vendedores-layout">
        <div className="vendedores-list">
          <ul>
            {vendedores.map((v) => (
              <li key={v.id}>
                <div className="vendedor-info">
                  {v.id} - {v.nome} - {v.telefone}
                </div>
                {usuario.perfil === "VENDEDOR" && (
                  <div className="vendedor-actions">
                    <button onClick={() => carregarParaEdicao(v)}>Editar</button>
                    <button onClick={() => handleExcluirVendedor(v.id)}>
                      Excluir
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {usuario.perfil === "VENDEDOR" && (
          <div className="vendedores-form">
            <h3>
              {editandoId ? "Editar vendedor" : "Cadastrar novo vendedor"}
            </h3>
            <form onSubmit={handleSalvarVendedor}>
              <input
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={!!editandoId}
              />
              <input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                placeholder="Telefone"
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
    </div>
  );
}
