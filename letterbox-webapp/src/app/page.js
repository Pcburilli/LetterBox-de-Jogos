'use client'

import { useState, useEffect } from 'react';

export default function Page() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const BuscarJogos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jogos');

      if (response.ok) {
        const dados = await response.json();
        setJogos(dados)
      }
      } catch (error) {
      console.error('Erro ao buscar jogo:', error);
    } finally {
      setCarregando(false)
    }
  };
  useEffect(() => {
    BuscarJogos();
  }, []);
  return (
    <div id='div_principal'>
      <div style={{ padding: '20px', textAlign: 'center'}}>
        <h1 style={{fontSize: '3em'}}>Lista de Jogos Cadastrados</h1>
        {carregando ? (
          <p>Carregando jogos...</p>
        ) : (
          <ul className="grid grid-cols-3 gap-1 max-w-4xl mx-auto">
            {jogos.map((jogo, index) => (
              <li key={jogo.id || index} className="capitalize">{jogo.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};