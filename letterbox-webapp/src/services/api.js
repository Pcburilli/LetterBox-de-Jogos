const API_BASE = 'http://localhost:5000/api';

export async function adicionarAoCatalogo(game_id) {
  const response = await fetch(`${API_BASE}/catalog/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_id: game_id }),
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
    const response = await fetch('http://localhost:5000/api/games/');
    const dados = await response.json();
    return dados
}

export async function ObterJogosSearch(search, page) {
    const response = await fetch(`http://localhost:5000/api/games/search?q=${encodeURIComponent(search)}&page=${page}`);
    const dados = await response.json();
    return dados
}

export async function ObterJogo(nome) {
    const response = await fetch(`http://localhost:5000/api/games/${nome}`);
    const dados = await response.json();
    return dados
  };

export async function ObterJogoInfo(nome) {
    const response = await fetch(`http://localhost:5000/api/games/${nome}/statistics`);
    const dados = await response.json();
    return dados
  };

export async function ObterCatalogo() {
    const response = await fetch('http://localhost:5000/api/catalog/', {
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

export async function AlterarStatusJogo(game_id, new_status) {
    const response = await fetch(`http://localhost:5000/api/catalog/${game_id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'},
        body: JSON.stringify({ new_status: new_status }),
        credentials: 'include'
      })
    return response
}

export async function VerificarAvaliacaoJogo(game_id) {
  const response = await fetch(`http://localhost:5000/api/catalog/review/${game_id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
        credentials: 'include'
      })
    const dados = await response.json();
    return dados
}

export async function AdicionarAvaliacaoJogo(game_id, review_data) {
  const response = await fetch(`http://localhost:5000/api/catalog/review/${game_id}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'},
        body: JSON.stringify({ review_data: review_data }),
        credentials: 'include'
      })
    return response
}

export async function ObterGenres() {
  const response = await fetch('http://localhost:5000/api/games/genres', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
      })

    const dados = await response.json();
    return dados
}

export async function ObterTags() {
  const response = await fetch('http://localhost:5000/api/games/tags', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
      })

    const dados = await response.json();
    return dados
}

export async function ObterDevs() {
  const response = await fetch('http://localhost:5000/api/games/developers', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
      })

    const dados = await response.json();
    return dados
}
export async function FiltersGames(filters, page) {
  const response = await fetch(`http://localhost:5000/api/games/filters?${filters}&page=${page}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'},
      })

    const dados = await response.json();
    return dados
}