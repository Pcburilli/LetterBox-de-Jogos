'use client';
import { useState, useEffect } from 'react';

export default function PerfilCard() {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [username, setUsername] = useState('');

  const ObterPerfil = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const dados = await response.json();
        setDadosUsuario(dados);
        setUsername(dados.username || '');
      }
    } catch (error) {
      console.error('Deu ruim ao carregar perfil:', error);
    }
  };

  useEffect(() => {
    ObterPerfil();
  }, []);

  const alterarUsername = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || username === dadosUsuario?.username) return;

    try {
      const response = await fetch('http://localhost:5000/api/register/username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
        credentials: 'include'
      });

      if (response.ok) {
        await ObterPerfil();
        alert(`Username alterado para: ${username}`);
      } else {
        const erroData = await response.json();
        alert(erroData.mensagem || 'Erro ao alterar username.');
      }
    } catch (error) {
      console.warn('Error:', error);
    }
  };

  const podeAlterar = username.trim() !== '' && username !== dadosUsuario?.username;

  return (
    <div id="Perfil" className="grid w-max p-3 m-2 bg-slate-900/95 text-white rounded-2xl gap-2">
      <p>*Foto de perfil*</p>
      
      <label htmlFor="nome" className="flex items-center">
        Username:
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="(máx. 10 caracteres)"
          maxLength={10}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="capitalize ml-1 rounded bg-slate-800 text-white focus:outline-none"
        />
      </label>

      {podeAlterar && (
        <button
          onClick={alterarUsername}
          className="bg-blue-600 hover:bg-blue-500 rounded transition"
        >
          Alterar Username
        </button>
      )}

      <p className=" text-slate-400">
        Email: {dadosUsuario?.email || 'Carregando...'}
      </p>
    </div>
  );
}