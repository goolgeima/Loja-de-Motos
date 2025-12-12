import { useEffect, useState } from "react";
import "./ClientesPage.css";

export function ClientesPage({ usuario }) {
  const [clientes, setClientes] = useState([]);

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    async function carregar() {
      const resp = await fetch("http://localhost:3000/clientes");
      const data = await resp.json();
      setClientes(data.clientes || data);
    }
    carregar();
  }, []);

  function limparForm() {
    setId("");
    setNome("");
    setCpf("");
    setTelefone("");
    setEditandoId(null);
  }

  function carregarParaEdicao(c) {
    setEditandoId(c.id);
    setId(c.id);
    setNome(c.nome);
    setCpf(c.cpf);
    setTelefone(c.telefone);
  }

  async function handleSalvarCliente(e) {
    e.preventDefault();

    const idNum = Number(id);
    if (!id || isNaN(idNum) || idNum <= 0) {
      alert("Informe um ID válido.");
      return;
    }
    if (!nome || !cpf) {
      alert("Preencha nome e CPF.");
      return;
    }

    const cliente = {
      id: idNum,
      nome,
      cpf,
      telefone,
    };

    const url = editandoId
      ? `http://localhost:3000/clientes/${editandoId}`
      : "http://localhost:3000/clientes";
    const method = editandoId ? "PUT" : "POST";

    const resp = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        perfil: usuario.perfil,
      },
      body: JSON.stringify(cliente),
    });

    if (!resp.ok) {
      alert("Erro ao salvar cliente");
      return;
    }

    const salvo = await resp.json();
    if (editandoId) {
      setClientes((prev) =>
        prev.map((c) => (c.id === editandoId ? salvo : c))
      );
    } else {
      setClientes((prev) => [...prev, salvo]);
    }

    limparForm();
  }

  async function handleExcluirCliente(idCliente) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const resp = await fetch(`http://localhost:3000/clientes/${idCliente}`, {
      method: "DELETE",
      headers: {
        perfil: usuario.perfil,
      },
    });

    if (!resp.ok) {
      alert("Erro ao excluir cliente");
      return;
    }

    setClientes((prev) => prev.filter((c) => c.id !== idCliente));
    if (editandoId === idCliente) limparForm();
  }

  return (
    <div className="clientes-root">
      <h2>Clientes</h2>

      <div className="clientes-layout">
        <div className="clientes-list">
          <ul>
            {clientes.map((c) => (
              <li key={c.id}>
                <div className="cliente-info">
                  {c.id} - {c.nome} - {c.cpf} - {c.telefone}
                </div>
                {usuario.perfil === "VENDEDOR" && (
                  <div className="cliente-actions">
                    <button onClick={() => carregarParaEdicao(c)}>Editar</button>
                    <button onClick={() => handleExcluirCliente(c.id)}>
                      Excluir
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {usuario.perfil === "VENDEDOR" && (
          <div className="clientes-form">
            <h3>{editandoId ? "Editar cliente" : "Cadastrar novo cliente"}</h3>
            <form onSubmit={handleSalvarCliente}>
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
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />

              <button type="submit">
                {editandoId ? "Atualizar cliente" : "Salvar cliente"}
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
