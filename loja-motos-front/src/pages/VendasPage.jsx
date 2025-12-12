import { useEffect, useState } from "react";
import "./VendasPage.css";

export function VendasPage({ usuario }) {
  const [vendas, setVendas] = useState([]);
  const [motos, setMotos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  const [id, setId] = useState("");
  const [idMoto, setIdMoto] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [nomeVendedor, setNomeVendedor] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");

  const [campoOrdenacao, setCampoOrdenacao] = useState("data");
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState("desc");
  const [filtroTexto, setFiltroTexto] = useState("");

  useEffect(() => {
    async function carregarTudo() {
      const [vRes, mRes, cRes, vendRes] = await Promise.all([
        fetch("http://localhost:3000/vendas"),
        fetch("http://localhost:3000/motos"),
        fetch("http://localhost:3000/clientes"),
        fetch("http://localhost:3000/vendedores"),
      ]);

      const vData = await vRes.json();
      const mData = await mRes.json();
      const cData = await cRes.json();
      const vendData = await vendRes.json();

      setVendas(vData.vendas || vData);
      setMotos(mData.motos || mData);
      setClientes(cData.clientes || cData);
      setVendedores(vendData.vendedores || vendData);
    }
    carregarTudo();
  }, []);

  async function handleCriarVenda(e) {
    e.preventDefault();

    const idNum = Number(id);
    if (!id || isNaN(idNum) || idNum <= 0) {
      alert("Informe um ID válido.");
      return;
    }

    if (
      !idMoto ||
      !nomeCliente ||
      !nomeVendedor ||
      !data ||
      !valor ||
      !formaPagamento
    ) {
      alert("Preencha todos os campos da venda.");
      return;
    }

    const nova = {
      id: idNum,
      id_moto: Number(idMoto),
      nome_cliente: nomeCliente,
      nome_vendedor: nomeVendedor,
      data,
      valor: Number(valor),
      forma_pagamento: formaPagamento,
    };

    const resp = await fetch("http://localhost:3000/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        perfil: usuario.perfil,
      },
      body: JSON.stringify(nova),
    });

    if (!resp.ok) {
      alert("Erro ao criar venda");
      return;
    }

    const criada = await resp.json();
    setVendas((prev) => [...prev, criada]);

    setId("");
    setIdMoto("");
    setNomeCliente("");
    setNomeVendedor("");
    setData("");
    setValor("");
    setFormaPagamento("");
  }

  function getModeloMoto(idMoto) {
    const moto = motos.find((m) => m.id === Number(idMoto));
    return moto ? `${moto.marca} ${moto.modelo}` : `Moto ${idMoto}`;
  }

  const totalVendas = vendas.length;
  const valorTotal = vendas.reduce(
    (soma, v) => soma + (Number(v.valor) || 0),
    0
  );

  // filtro por cliente / vendedor (e moto, se quiser)
  const vendasFiltradas = vendas.filter((v) => {
    if (!filtroTexto.trim()) return true;
    const termo = filtroTexto.toLowerCase();
    const motoTexto = getModeloMoto(v.id_moto).toLowerCase();
    return (
      v.nome_cliente.toLowerCase().includes(termo) ||
      v.nome_vendedor.toLowerCase().includes(termo) ||
      motoTexto.includes(termo)
    );
  });

  // ordenação
  const vendasOrdenadas = [...vendasFiltradas].sort((a, b) => {
    const dir = direcaoOrdenacao === "asc" ? 1 : -1;

    if (campoOrdenacao === "valor") {
      return (a.valor - b.valor) * dir;
    }
    if (campoOrdenacao === "data") {
      return a.data.localeCompare(b.data) * dir;
    }

    const va = String(a[campoOrdenacao] || "");
    const vb = String(b[campoOrdenacao] || "");
    return va.localeCompare(vb) * dir;
  });

  return (
    <div className="vendas-root">
      <h2>Vendas</h2>

      <div className="vendas-dashboard">
        <div className="vd-card">
          <span className="vd-label">Total de vendas</span>
          <span className="vd-value">{totalVendas}</span>
        </div>
        <div className="vd-card">
          <span className="vd-label">Valor total vendido</span>
          <span className="vd-value">
            {valorTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>

      <div className="vendas-filtros">
        <input
          placeholder="Filtre aqui"
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
        />

        <div className="vendas-ordenacao">
          <span>Ordenar por:</span>
          <select
            value={campoOrdenacao}
            onChange={(e) => setCampoOrdenacao(e.target.value)}
          >
            <option value="data">Data</option>
            <option value="valor">Valor</option>
            <option value="nome_cliente">Nome do cliente</option>
            <option value="nome_vendedor">Nome do vendedor</option>
          </select>

          <select
            value={direcaoOrdenacao}
            onChange={(e) => setDirecaoOrdenacao(e.target.value)}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <h3>Vendas</h3>
      <ul className="vendas-list">
        {vendasOrdenadas.map((v) => (
          <li key={v.id}>
            #{v.id} - {getModeloMoto(v.id_moto)} - Cliente {v.nome_cliente} -
            Vendedor {v.nome_vendedor} - {v.data} - R${v.valor} (
            {v.forma_pagamento})
          </li>
        ))}
      </ul>

      {usuario.perfil === "VENDEDOR" && (
        <div className="vendas-form">
          <h3>Registrar nova venda</h3>
          <form onSubmit={handleCriarVenda}>
            <input
              placeholder="ID da venda"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />

            <select
              value={idMoto}
              onChange={(e) => setIdMoto(e.target.value)}
            >
              <option value="" disabled>
                Selecione a moto
              </option>
              {motos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} - {m.marca} {m.modelo}
                </option>
              ))}
            </select>

            <select
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
            >
              <option value="" disabled>
                Selecione o cliente
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.nome}>
                  {c.id} - {c.nome}
                </option>
              ))}
            </select>

            <select
              value={nomeVendedor}
              onChange={(e) => setNomeVendedor(e.target.value)}
            >
              <option value="" disabled>
                Selecione o vendedor
              </option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.nome}>
                  {v.id} - {v.nome}
                </option>
              ))}
            </select>

            <input
              placeholder="Data da venda"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <input
              placeholder="Valor (R$)"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            >
              <option value="" disabled>
                Selecione a forma de pagamento
              </option>
              <option value="CREDITO">Crédito</option>
              <option value="DEBITO">Débito</option>
              <option value="PIX">Pix</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>

            <button type="submit">Salvar venda</button>
          </form>
        </div>
      )}
    </div>
  );
}
