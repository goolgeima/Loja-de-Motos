import { useEffect, useState } from "react";

export function VendasPage({ usuario }) {
  const [vendas, setVendas] = useState([]);
  const [motos, setMotos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  const [id, setId] = useState("");
  const [idMoto, setIdMoto] = useState("");
  const [loginCliente, setLoginCliente] = useState("");
  const [loginVendedor, setLoginVendedor] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");

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
    
    // logs de erros
    if (!id || isNaN(idNum) || id <= 0) {
        alert("Informe um ID válido.");
        return;
    }
    const nova = {
      id: Number(id),
      id_moto: Number(idMoto),
      login_cliente: loginCliente,
      login_vendedor: loginVendedor,
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
    setLoginCliente("");
    setLoginVendedor("");
    setData("");
    setValor("");
    setFormaPagamento("");
  }

  return (
    <div>
      <h2>Vendas</h2>

      <ul>
        {vendas.map((v) => (
          <li key={v.id}>
            #{v.id} - Moto {v.id_moto} - Cliente {v.login_cliente} - Vendedor{" "}
            {v.login_vendedor} - {v.data} - R${v.valor} ({v.forma_pagamento})
          </li>
        ))}
      </ul>

      {usuario.perfil === "VENDEDOR" && (
        <div>
          <h3>Registrar nova venda</h3>
          <form onSubmit={handleCriarVenda}>
            <input
              placeholder="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />

            <select
              value={idMoto}
              onChange={(e) => setIdMoto(e.target.value)}
            >
              <option value="">Selecione a moto</option>
              {motos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} - {m.marca} {m.modelo}
                </option>
              ))}
            </select>

            <select
              value={loginCliente}
              onChange={(e) => setLoginCliente(e.target.value)}
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.login}>
                  {c.login} - {c.nome}
                </option>
              ))}
            </select>

            <select
              value={loginVendedor}
              onChange={(e) => setLoginVendedor(e.target.value)}
            >
              <option value="">Selecione o vendedor</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.login}>
                  {v.login} - {v.nome}
                </option>
              ))}
            </select>

            <input
            placeholder="Selecione a data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <input
              placeholder="Selecione o valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <input
              placeholder="Selecione a forma de pagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />

            <button type="submit">Salvar venda</button>
          </form>
        </div>
      )}
    </div>
  );
}
