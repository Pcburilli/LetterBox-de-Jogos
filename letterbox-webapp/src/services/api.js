const API_BASE = 'http://localhost:5000/api';

export async function adicionarAoCatalogo(idJogo) {
  const response = await fetch(`${API_BASE}/catalog/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_jogo: idJogo }),
    credentials: 'include',
  });
  return response;
}

export async function ObterPerfil() {
    const response = await fetch('http://localhost:5000/api/auth/me', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
    });
    const dados = await response.json();
    return dados;
  };

export async function ObterJogos() {
    const response = await fetch('http://localhost:5000/api/jogos');
    const dados = await response.json();
    return dados
}

export async function ObterJogosSearch(search, page) {
    const response = await fetch(`http://localhost:5000/api/jogos/search?q=${encodeURIComponent(search)}&page=${page}`);
    const dados = await response.json();
    return dados
}

export async function ObterJogo(nome) {
    const response = await fetch(`http://localhost:5000/api/jogos/${nome}`);
    const dados = await response.json();
    return dados
  };

export async function ObterCatalogo() {
    const response = await fetch('http://localhost:5000/api/catalog', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
        credentials: 'include'
      })
    const dados = await response.json();
    return dados
}

export async function VerificarJogoCatalogo(idJogo) {
    const response = await fetch(`http://localhost:5000/api/catalog/${idJogo}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
        credentials: 'include'
      })
    const dados = await response.json();
    return dados
}

export async function DeleteJogoCatalogo(idJogo) {
    const response = await fetch(`http://localhost:5000/api/catalog/${idJogo}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'},
        credentials: 'include'
      })
    return response
}

export async function AlterarStatusJogo(idJogo, new_status) {
    const response = await fetch(`http://localhost:5000/api/catalog/${idJogo}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'},
        body: JSON.stringify({ new_status: new_status }),
        credentials: 'include'
      })
    return response
}

export async function VerificarAvaliacaoJogo(idJogo) {
  const response = await fetch(`http://localhost:5000/api/catalog/avaliacao/${idJogo}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
        credentials: 'include'
      })
    const dados = await response.json();
    return dados
}

export async function AdicionarAvaliacaoJogo(idJogo, dados_avaliacao) {
  const response = await fetch(`http://localhost:5000/api/catalog/avaliacao/${idJogo}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'},
        body: JSON.stringify({ dados_avaliacao: dados_avaliacao }),
        credentials: 'include'
      })
    return response
}