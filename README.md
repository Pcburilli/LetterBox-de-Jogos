# LetterBox de Jogos

> Projeto de Conclusão de Curso — Faculdade Impacta (EAD)

O **LetterBox de Jogos** é uma aplicação web para descobrir, organizar e avaliar jogos, inspirada no Letterboxd. Qualquer visitante pode explorar o acervo, ver detalhes, reviews e perfis. Usuários cadastrados montam a sua biblioteca pessoal, acompanham o status de cada jogo e publicam reviews com nota e/ou resenha. Administradores gerenciam o acervo (inclusive importando jogos de uma API externa), os usuários e as reviews.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Como executar](#como-executar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Documentação](#documentação)
- [Autor](#autor)

---

## Funcionalidades

**Visitante**

- Visualizar o acervo de jogos, com busca e filtros (gênero, tags e desenvolvedora)
- Visualizar detalhes de um jogo e suas reviews
- Visualizar perfis de usuários
- Realizar cadastro e login

**Usuário autenticado**

- Editar o perfil (nome de usuário e ícone)
- Adicionar jogos à biblioteca, alterar o status de cada um e removê-los
- Publicar reviews dos jogos da biblioteca, com nota, resenha ou ambos

**Administrador**

- Visualizar o dashboard
- Cadastrar jogos no acervo, manualmente ou buscando em uma API externa de jogos, selecionando gêneros, tags e desenvolvedoras
- Editar e excluir jogos do acervo
- Excluir usuários comuns
- Excluir reviews

---

## Tecnologias

| Camada               | Tecnologia                                        |
| -------------------- | ------------------------------------------------- |
| Front-end            | [Next.js](https://nextjs.org/) (Node.js 20)       |
| Back-end             | [Flask](https://flask.palletsprojects.com/) (Python 3) servido com Gunicorn |
| Banco de dados       | [PostgreSQL](https://www.postgresql.org/)         |
| Dados de jogos       | [RAWG API](https://rawg.io/apidocs)               |
| Administração do BD  | [pgAdmin 4](https://www.pgadmin.org/)             |
| Proxy reverso        | [Nginx](https://nginx.org/)                       |
| Exposição pública    | [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) (`cloudflared`) |
| Containerização      | Docker e Docker Compose                           |

---

## Arquitetura

Todos os serviços sobem juntos via Docker Compose. O Nginx é a porta de entrada: requisições para `/api/` vão para a API Flask e todo o restante vai para o front-end Next.js.

```
 Internet
    │
    ▼
┌──────────────────┐
│ Cloudflare Tunnel│
└────────┬─────────┘
         ▼
     ┌───────┐   /api/*   ┌──────────────────┐      ┌────────────┐
     │ Nginx │ ─────────► │ webapi (Flask)   │ ───► │ PostgreSQL │
     └───┬───┘            └──────────────────┘      └────────────┘
         │  /*
         ▼
  ┌──────────────────┐
  │ webapp (Next.js) │
  └──────────────────┘
```

| Serviço    | Container           | Porta interna | Porta no host | Função                         |
| ---------- | ------------------- | ------------- | ------------- | ------------------------------ |
| `postgres` | `letterbox-postgres`| 5432          | —             | Banco de dados                 |
| `pgadmin`  | `meu-pgadmin`       | 80            | 5050          | Interface de administração     |
| `webapi`   | `letterbox-webapi`  | 5000          | —             | API REST (Flask)               |
| `webapp`   | `letterbox-webapp`  | 3000          | —             | Interface web (Next.js)        |
| `proxy`    | `letterbox-proxy`   | 80            | 80            | Nginx (reverse proxy)          |
| `tunnel`   | `letterbox-tunnel`  | —             | —             | Túnel público Cloudflare       |

---------- | ------------------- | ------------- | ------------------------------ |
| `postgres` | `letterbox-postgres`| 5432          | Banco de dados                 |
| `pgadmin`  | `meu-pgadmin`       | 80            | Interface de administração     |
| `webapi`   | `letterbox-webapi`  | 5000          | API REST (Flask)               |
| `webapp`   | `letterbox-webapp`  | 3000          | Interface web (Next.js)        |
| `proxy`    | `letterbox-proxy`   | 80            | Nginx (reverse proxy)          |
| `tunnel`   | `letterbox-tunnel`  | —             | Túnel público Cloudflare       |

---

## Estrutura do repositório

```
LetterBox-de-Jogos/
├── docs/                 # Documentação do projeto (diagramas)
├── letterbox-webapi/     # API Flask (back-end)
├── letterbox-webapp/     # Aplicação Next.js (front-end)
├── nginx/                # Configuração do Nginx (nginx.conf)
├── docker-compose.yml    # Orquestração dos containers
├── .gitignore
└── README.md
```

---

## Pré-requisitos

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) e Docker Compose

Para rodar sem Docker (opcional):

- Python 3 e `pip`
- Node.js 20 e `npm`
- PostgreSQL

---

## Como executar

### Com Docker (recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/Pcburilli/LetterBox-de-Jogos.git
cd LetterBox-de-Jogos

# 2. Crie o arquivo .env (veja a seção "Variáveis de ambiente")
#    ./.env                      (raiz do projeto)

# 3. Suba todos os serviços
docker compose up --build
```

### Acessando a aplicação

| O quê                | Endereço                                         |
| -------------------- | ------------------------------------------------ |
| Aplicação (local)    | http://localhost                                 |
| API (local)          | http://localhost/api                             |
| pgAdmin              | http://localhost:5050                            |
| Acesso público       | URL gerada pelo Cloudflare Tunnel (veja abaixo)  |

O **Cloudflare Tunnel** (modo rápido) gera uma URL pública temporária a cada execução. Para descobri-la:

```bash
docker compose logs tunnel
```

Procure por uma URL no formato `https://<nome-aleatorio>.trycloudflare.com`.

No pgAdmin, cadastre o servidor usando o host `postgres`, porta `5432` e as credenciais definidas no `.env`.

### Parando os serviços

```bash
docker compose down        # mantém os dados do banco
docker compose down -v     # remove também o volume do banco
```

### Sem Docker (desenvolvimento local)

```bash
# API (Flask)
cd letterbox-webapi
python -m venv venv
venv\Scripts\activate             # Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
py run.py                         # Linux/macOS: gunicorn --reload --bind 0.0.0.0:5000 run:app

# Aplicação web (Next.js)
cd letterbox-webapp
npm install
npm run dev
```

> Nesse modo, é necessário ter um PostgreSQL rodando e as variáveis `DATABASE_URL` (com host `localhost`) e `SECRET_KEY` definidas no ambiente da API. Para o front-end, crie o `letterbox-webapp/.env` (veja [Variáveis de ambiente](#-variáveis-de-ambiente)). Por padrão, o front-end acessa a API em `http://localhost:5000/api`; para usar outro endereço, defina `NEXT_PUBLIC_API_URL` (navegador) e `INTERNAL_API_URL` (servidor Next.js).

---

### Primeiro acesso (Administrador)

Após iniciar a aplicação pela primeira vez:

1. Acesse a interface web e crie um usuário utilizando exatamente o username **`admin`** (com qualquer senha de sua preferência).
2. Reinicie o serviço do back-end para ativar as permissões administrativas:

```bash
# Com Docker Compose:
docker compose restart webapi

# Sem Docker (desenvolvimento local):
# Pare o terminal da API (Ctrl + C) e execute novamente: py run.py
```

Após reiniciar, faça login com a conta admin e acesse o painel administrativo pela rota /admin (http://localhost/admin).

Controle de acesso: A rota /admin é restrita a administradores. Caso um visitante ou usuário comum tente acessá-la diretamente, ele será redirecionado automaticamente para a página anterior

---

## Variáveis de ambiente

Com Docker, o projeto usa um único arquivo `.env`, na raiz, que **não deve ser versionado**. Para desenvolvimento local (sem Docker), o front-end usa também um `.env` próprio.

### `./.env` (raiz do projeto)

Lido pelo Docker Compose para preencher os serviços. Crie o arquivo com base no modelo abaixo:

```env
# Banco de dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=seu_nome_DB
DATABASE_URL=postgresql://postgres:sua_senha@postgres:5432/seu_nome_DB?client_encoding=utf8

# pgAdmin
EMAIL_PG=email@email.com
PASSWORD_PG=sua_senha_pgadmin

# Back-end
SECRET_KEY=sua_chave_secreta_back_end

# Front-end
KEY_API=sua_chave_api_rawg
```

| Variável            | Descrição                                                                 |
| ------------------- | ------------------------------------------------------------------------- |
| `POSTGRES_USER`     | Usuário do PostgreSQL                                                     |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL                                                       |
| `POSTGRES_DB`       | Nome do banco de dados                                                    |
| `DATABASE_URL`      | String de conexão usada pela API Flask (deve repetir usuário, senha e banco acima) |
| `EMAIL_PG`          | E-mail de login do pgAdmin                                                |
| `PASSWORD_PG`       | Senha de login do pgAdmin                                                 |
| `SECRET_KEY`        | Chave secreta do back-end Flask (use um valor longo e aleatório)          |
| `KEY_API`           | Chave da [RAWG API](https://rawg.io/apidocs), usada para buscar dados dos jogos (gere a sua gratuitamente no site) |

> **Host do banco:** dentro do Docker, use `postgres` (nome do serviço) em `DATABASE_URL`. Use `localhost` apenas se rodar a API **fora** do Docker, com o PostgreSQL local.

### `./letterbox-webapp/.env` (apenas desenvolvimento local)

Usado somente ao rodar o front-end fora do Docker (`npm run dev`). Com Docker, vale o `.env` da raiz.

```env
KEY_API=sua_chave_api_rawg
```

---

## Endpoints da API

Todas as rotas têm o prefixo `/api`. A autenticação usa cookies, então o front-end envia `credentials: 'include'` nas requisições.

**Acesso:** `Público` não exige login, `Autenticado` exige usuário logado e `Restrito` é voltado à área administrativa.

### Autenticação

| Método | Rota                       | Descrição                    | Acesso      |
| ------ | -------------------------- | ---------------------------- | ----------- |
| POST   | `/auth/register`           | Cadastra um usuário          | Público     |
| POST   | `/auth/login`              | Realiza login                | Público     |
| POST   | `/auth/logout`             | Realiza logout               | Autenticado |
| GET    | `/auth/me`                 | Dados do usuário logado      | Autenticado |
| PUT    | `/auth/register/username`  | Altera o nome de usuário     | Autenticado |
| PUT    | `/auth/register/icon`      | Altera o ícone do perfil     | Autenticado |

### Jogos

| Método | Rota                          | Descrição                                   | Acesso   |
| ------ | ----------------------------- | ------------------------------------------- | -------- |
| GET    | `/index/`                     | Dados da página inicial                     | Público  |
| GET    | `/games/search?q=&page=`      | Busca jogos por nome                        | Público  |
| GET    | `/games/filters?...&page=`    | Filtra jogos (gênero, tags, desenvolvedora) | Público  |
| GET    | `/games/genres`               | Lista gêneros                               | Público  |
| GET    | `/games/tags`                 | Lista tags                                  | Público  |
| GET    | `/games/developers`           | Lista desenvolvedoras                       | Público  |
| GET    | `/games/<nome>`               | Detalhes de um jogo                         | Público  |
| GET    | `/games/<nome>/statistics`    | Estatísticas de um jogo                     | Público  |
| POST   | `/games/`                     | Cadastra um jogo                            | Restrito |
| PATCH  | `/games/<id>`                 | Edita um jogo                               | Restrito |
| DELETE | `/games/<id>`                 | Exclui um jogo                              | Restrito |

### Biblioteca e avaliações

| Método | Rota                      | Descrição                                  | Acesso      |
| ------ | ------------------------- | ------------------------------------------ | ----------- |
| GET    | `/catalog/<id_jogo>`      | Verifica se o jogo está na biblioteca      | Autenticado |
| POST   | `/catalog/add`            | Adiciona um jogo à biblioteca             | Autenticado |
| PUT    | `/catalog/<id_jogo>`      | Altera o status do jogo na biblioteca     | Autenticado |
| DELETE | `/catalog/<id_jogo>`      | Remove o jogo da biblioteca (apaga a review)| Autenticado |
| GET    | `/catalog/review/<id>`    | Obtém a avaliação do usuário para o jogo   | Autenticado |
| POST   | `/catalog/review/<id>`    | Cria a avaliação (jogo na biblioteca)    | Autenticado |

### Usuários e administração

| Método | Rota                        | Descrição                       | Acesso   |
| ------ | --------------------------- | ------------------------------- | -------- |
| GET    | `/users/<username>`         | Perfil público de um usuário    | Público  |
| GET    | `/users?page=`              | Lista usuários                  | Restrito |
| DELETE | `/users/<id>`               | Exclui um usuário               | Restrito |
| GET    | `/users/reviews?page=`      | Lista avaliações                | Restrito |
| DELETE | `/users/reviews/<id>`       | Exclui uma avaliação            | Restrito |
| GET    | `/dashboard/`               | Dados do dashboard              | Restrito |

---

## Documentação

Os diagramas e demais documentos do projeto estão na pasta [`docs/`](./docs).

### Diagrama de casos de uso

![Diagrama de casos de uso](./docs/Caso%20de%20Uso%20StockG.png)

### Diagrama de classes

![Diagrama de classes](./docs/Diagrama%20de%20Classes%20StockG.png)

---

## Autor

**Pcburilli**

- GitHub: [@Pcburilli](https://github.com/Pcburilli)

Projeto desenvolvido como Trabalho de Conclusão de Curso na **Faculdade Impacta (EAD)**.
