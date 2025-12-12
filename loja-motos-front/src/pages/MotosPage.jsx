import { useEffect, useState } from "react";
import "./MotosPage.css";

export function MotosPage({ usuario }) {
  const [motos, setMotos] = useState([]);

  const [id, setId] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cilindrada, setCilindrada] = useState("");
  const [cavalos, setCavalos] = useState("");
  const [estilo, setEstilo] = useState("");
  const [quilometragem, setQuilometragem] = useState("");
  const [preco, setPreco] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    async function carregar() {
      const resp = await fetch("http://localhost:3000/motos");
      const data = await resp.json();
      setMotos(data.motos || data);
    }
    carregar();
  }, []);

  function limparForm() {
    setId("");
    setMarca("");
    setModelo("");
    setAno("");
    setCilindrada("");
    setCavalos("");
    setEstilo("");
    setQuilometragem("");
    setPreco("");
    setEditandoId(null);
  }

  function carregarParaEdicao(m) {
    setEditandoId(m.id);
    setId(m.id);
    setMarca(m.marca);
    setModelo(m.modelo);
    setAno(m.ano);
    setCilindrada(m.cilindrada);
    setCavalos(m.cavalos);
    setEstilo(m.estilo);
    setQuilometragem(m.quilometragem);
    setPreco(m.preco);
  }

  async function handleSalvarMoto(e) {
    e.preventDefault();

    const idNum = Number(id);
    if (!id || isNaN(idNum) || idNum <= 0) {
      alert("Informe um ID válido (número > 0).");
      return;
    }

    if (!marca || !modelo) {
      alert("Preencha marca e modelo.");
      return;
    }

    if (!ano || isNaN(Number(ano))) {
      alert("Informe um ano válido.");
      return;
    }

    if (!preco || isNaN(Number(preco))) {
      alert("Informe um preço válido.");
      return;
    }

    if (Number(preco) <= 0) {
      alert("A moto tá de graça? Não né.");
      return;
    }

    const moto = {
      id: idNum,
      marca,
      modelo,
      ano: Number(ano),
      cilindrada: Number(cilindrada),
      cavalos: Number(cavalos),
      estilo,
      quilometragem: Number(quilometragem),
      preco: Number(preco),
    };

    const url = editandoId
      ? `http://localhost:3000/motos/${editandoId}`
      : "http://localhost:3000/motos";
    const method = editandoId ? "PUT" : "POST";

    const resp = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        perfil: usuario.perfil,
      },
      body: JSON.stringify(moto),
    });

    if (!resp.ok) {
      alert("Erro ao salvar moto");
      return;
    }

    const salva = await resp.json();

    if (editandoId) {
      setMotos((prev) => prev.map((m) => (m.id === editandoId ? salva : m)));
    } else {
      setMotos((prev) => [...prev, salva]);
    }

    limparForm();
  }

  async function handleExcluirMoto(idMoto) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const resp = await fetch(`http://localhost:3000/motos/${idMoto}`, {
      method: "DELETE",
      headers: {
        perfil: usuario.perfil,
      },
    });

    if (!resp.ok) {
      alert("Erro ao excluir moto");
      return;
    }

    setMotos((prev) => prev.filter((m) => m.id !== idMoto));
    if (editandoId === idMoto) limparForm();
  }

  return (
    <div className="motos-root">
      <h2>Lista de motos</h2>

      <div className="motos-layout">
        <div className="motos-list">
          <ul>
            {motos.map((m) => (
              <li key={m.id}>
                <div className="moto-info">
                  {m.id} - {m.marca} {m.modelo} ({m.ano}) - {m.cilindrada}cc,{" "}
                  {m.cavalos}cv, {m.estilo}, {m.quilometragem}km - R${m.preco}
                </div>
                {usuario.perfil === "VENDEDOR" && (
                  <div className="moto-actions">
                    <button onClick={() => carregarParaEdicao(m)}>Editar</button>
                    <button onClick={() => handleExcluirMoto(m.id)}>
                      Excluir
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {usuario.perfil === "VENDEDOR" && (
          <div className="motos-form">
            <h3>{editandoId ? "Editar moto" : "Cadastrar nova moto"}</h3>
            <form onSubmit={handleSalvarMoto}>
              <input
                placeholder="ID da moto"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={!!editandoId}
              />
              <input
                placeholder="Marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
              <input
                placeholder="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
              <input
                placeholder="Ano"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
              <input
                placeholder="Cilindrada (cc)"
                value={cilindrada}
                onChange={(e) => setCilindrada(e.target.value)}
              />
              <input
                placeholder="Cavalos (cv)"
                value={cavalos}
                onChange={(e) => setCavalos(e.target.value)}
              />
              <input
                placeholder="Estilo"
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
              />
              <input
                placeholder="Quilometragem (km)"
                value={quilometragem}
                onChange={(e) => setQuilometragem(e.target.value)}
              />
              <input
                placeholder="Preço (R$)"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />

              <button type="submit">
                {editandoId ? "Atualizar moto" : "Salvar moto"}
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
