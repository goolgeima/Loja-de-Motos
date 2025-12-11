import { useState } from "react";

export function AlterarSenhaPage({ usuario }) {
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  async function handleAlterarSenha(e) {
    e.preventDefault();

    if (novaSenha !== confirmacao) {
      alert("Nova senha e confirmação não conferem");
      return;
    }

    const isCliente = usuario.perfil === "CLIENTE";
    const base =
      isCliente ? "http://localhost:3000/clientes" : "http://localhost:3000/vendedores";

    const url = `${base}/${usuario.login}/senha`;

    const resp = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senhaAntiga, novaSenha }),
    });

    if (!resp.ok) {
      const erro = await resp.json().catch(() => ({}));
      alert(erro.message || "Erro ao alterar senha");
      return;
    }

    alert("Senha alterada com sucesso");
    setSenhaAntiga("");
    setNovaSenha("");
    setConfirmacao("");
  }

  return (
    <div>
      <h2>Alterar senha</h2>
      <form onSubmit={handleAlterarSenha}>
        <input
          type="password"
          placeholder="Senha antiga"
          value={senhaAntiga}
          onChange={(e) => setSenhaAntiga(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
        />
        <button type="submit">Salvar nova senha</button>
      </form>
    </div>
  );
}
