# Loja de Motos – Aplicação Web

Aplicação web para gerenciamento de uma loja de motos, com autenticação de usuários, cadastro de motos, clientes, vendedores, controle de vendas e painel com resumo das vendas.

---

## Tecnologias utilizadas

**Frontend**
- React (Vite)
- CSS

**Backend**
- Node.js
- Express

**Dados**
- Armazenamento em memória (arrays no servidor Node)
  - Entidades: Usuários, Motos, Clientes, Vendedores, Vendas

---

## Como rodar o projeto

### 1. Backend (API)

1. Entre na pasta do backend:

"cd server"

2. Instale as dependências:

"npm install"

3. Inicie o servidor:

"nodemon server.js"

4. A API ficará disponível em: 

- `http://localhost:3000`

Rotas principais:
- `POST /usuarios/login` –
- `GET /motos`, `POST /motos`, `PUT /motos/:id`, `DELETE /motos/:id`
- `GET /clientes`, `POST /clientes`, `PUT /clientes/:id`, `DELETE /clientes/:id`
- `GET /vendedores`, `POST /vendedores`, `PUT /vendedores/:id`, `DELETE /vendedores/:id`
- `GET /vendas`, `POST /vendas`, `PUT /vendas/:id`, `DELETE /vendas/:id`
- `GET /usuarios`, `POST /usuarios`, `PUT /usuarios/:login`, `DELETE /usuarios/:login`

---

### 2. Frontend (React)

1. Entre na pasta do frontend:

"cd loja-motos-front"

2. Instale as dependências:

"npm install"

3. Inicie o projeto:

"npm run dev"

4. A aplicação ficará disponível (por padrão) em:
- `http://localhost:5173` (ou porta indicada pelo Vite)

---

## Usuários de exemplo

No controlador de usuários (`usuarioController.js`) há usuários iniciais em memória:

- Vendedor:
- login: `gustavovendedor`
- senha: `123`
- perfil: `VENDEDOR`

- Cliente:
- login: `gustavocliente`
- senha: `123`
- perfil: `CLIENTE`

Esses usuários são usados para testar os dois perfis de acesso.

---

## Funcionalidades do sistema

### Autenticação e perfis

- Tela de login integrada com a rota `POST /usuarios/login`.
- Dois perfis de usuário:
- `VENDEDOR`
- `CLIENTE`
- Após login, o sistema mostra o usuário logado e seu perfil no topo.

### Regras de permissão

- **CLIENTE**
- Menu: só enxerga as páginas **Motos** e **Vendas**.
- Não pode criar, editar ou excluir nenhum registro.
- Apenas visualiza as listas.

- **VENDEDOR**
- Menu: enxerga todas as páginas:
 - Motos, Clientes, Vendedores, Vendas, Usuários.
- Pode criar, editar e excluir registros em todas essas entidades.

### Entidades e CRUD

- **Motos**
- Campos: `id`, `marca`, `modelo`, `ano`, `cilindrada`, `cavalos`, `estilo`, `quilometragem`, `preco`.
- Funcionalidades:
 - Listar motos.
 - Criar nova moto.
 - Editar moto existente.
 - Excluir moto.

- **Clientes**
- Campos: `id`, `nome`, `cpf`, `telefone`.
- Funcionalidades:
 - Listar clientes.
 - Criar novo cliente.
 - Editar cliente.
 - Excluir cliente.

- **Vendedores**
- Campos: `id`, `nome`, `telefone`.
- Funcionalidades:
 - Listar vendedores.
 - Criar novo vendedor.
 - Editar vendedor.
 - Excluir vendedor.

- **Usuários**
- Campos: `login`, `senha`, `perfil`, `motoFavorita`.
- Funcionalidades:
 - Listar usuários.
 - Criar novo usuário (definindo login, senha, perfil e moto favorita).
 - Editar usuário (alterar senha, perfil e moto favorita; login não muda).
 - Excluir usuário.

- **Vendas**
- Campos: `id`, `id_moto`, `nome_cliente`, `nome_vendedor`, `data`, `valor`, `forma_pagamento`.
- Funcionalidades:
 - Registrar novas vendas vinculadas a uma moto e a nomes de cliente/vendedor.
 - Listar todas as vendas.

---

## Dashboard de vendas

Na página de **Vendas**, há um pequeno dashboard:

- Card com **total de vendas**.
- Card com **valor total vendido**, formatado em moeda brasileira (`R$ 0.000,00`).

Também há uma Lista de vendas com as seguintes informações:
- moto vendida,
- cliente,
- vendedor,
- data,
- valor,
- forma de pagamento.

### Ordenação

 É possível ordenar a lista de vendas por:
- Data,
- Valor,
- Nome do cliente,
- Nome do vendedor.

 Direção configurável:
- Ascendente,
- Descendente.

### Filtro

- Campo de filtro textual que permite pesquisar vendas por:
- Nome do cliente,
- Nome do vendedor,
- Modelo/marca da moto.

---

## Interface e layout

- Tema **dark mode** em toda a aplicação.
- Topbar com título e informações do usuário logado.
- Menu de navegação horizontal.
- Conteúdo principal em cards brancos/escuros por página.
- Em telas menores, as grades das páginas (lista + formulário) se tornam uma única coluna.

---

## Tratamento de erros

- Backend:
- Valida campos obrigatórios e tipos básicos (ex.: `id`, `valor`).
- Retorna códigos de status adequados (400, 404, 409, 401).
- Mensagens de erro em JSON, como:
 - `"id, nome, cpf e telefone são obrigatórios."`
 - `"ID de venda já existe."`
 - `"Usuário não encontrado."`
 - `"Credenciais inválidas."`

- Frontend:
- Exibe `alert()` em casos de:
 - Falha de validação local (ID inválido, campos vazios).
 - Erros na resposta do backend (status não-ok).

---

## Decisões de design

- **Separação entre pessoa e usuário**:
- Cliente e Vendedor guardam apenas dados pessoais (nome, telefone, etc.).
- Usuário guarda credenciais (login, senha, perfil) e uma informação opcional (moto favorita).
- Isso evita acoplar regras de autenticação diretamente às entidades de domínio (Clientes/Vendedores).

- **Dados em memória**:
- Para simplificar a entrega do trabalho, as entidades são mantidas em arrays no servidor.
- Facilita entender a lógica de CRUD e autenticação sem dependência de banco externo.

- **Regra de visualização para clientes**:
- Clientes interagem com o sistema apenas como consumidores de informação (Motos e Vendas).
- Todas as ações de cadastro são concentradas no perfil VENDEDOR.

---

## Possíveis extensões futuras

- Persistir os dados em um banco relacional (MySQL, PostgreSQL) em vez de arrays em memória.
- Implementar autenticação com JWT e proteção de rotas no backend.
- Adicionar gráficos no dashboard (ex.: vendas por mês, motos mais vendidas).
- Criar vínculo direto entre Usuário e Cliente/Vendedor (ex.: usuário do cliente X).
