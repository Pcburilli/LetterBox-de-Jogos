'use client'

import { useState, useEffect } from 'react';

export default function AdminPage() {
  // Busca API
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState(null);
  const [busca, setBusca] = useState('');
  // Busca Banco de Dados
  const [jogos, setJogos] = useState([]);
  // Jogo para Deletar
  const [jogoEncontrado, setJogoEncontrado] = useState('');

  const PesquisarJogo = async (e) => {
    e.preventDefault()
    const key_RAWG = '002cc90d42da48d39e2fc01f5b232936'

    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${key_RAWG}&search=${busca}&stores=1,2,3,5,6,11`)

      if (response.ok) {
        const resultado = await response.json();
        if (resultado['count'] > 0) {
          setDados(resultado);
        } else {
          setDados('Sem Resultado')
        }
      }
    } catch(error) {
      console.error('Erro na pesquisa:', error);
    } finally {
      setCarregando(false);
    }
  }

  const AdicionarJogo = async (e, jogo) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/jogos', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({jogo}),
      });
      console.log('Jogo:', jogo)
      const resultado = await response.json();

      if (response.ok) {
        alert('Registro realizado.')
        console.log('Registro realizado:', resultado);
      }
      else if (response.status === 400) {
        alert('Jogo já cadastrado.')
        console.warn('Erro:', resultado);
      }
    } catch (error) {
      console.error('Falha na conexão:', error);
    } finally {
      BuscarJogos();
    }
  }

  const DeletarJogo = async(e) => {
    e.preventDefault()

    const jogo_deletado = jogos.find((j) => j.name === jogoEncontrado);
    
    if (!jogo_deletado) {
      setJogoEncontrado('')
      alert('Selecione um jogo válido da lista.');
      return;
    }

    try {
    const response = await fetch(`http://localhost:5000/api/jogos/${jogo_deletado.id}`, {
      method:'DELETE'
    });

    if (response.ok) {
      const resultado = await response.json();
      alert('Jogo deletado.')
      console.log('Jogo deletado:', resultado.name);
    }
    else if (response.status === 404) {
      alert('Jogo inexistente.')
      console.warn('Erro:', response.status);
    }
    } catch (error) {
      console.error('Falha na conexão:', error);
    } finally {
      BuscarJogos();
      setJogoEncontrado('');
    }
  };

  const BuscarJogos = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/jogos');

    if (response.ok) {
      const dados = await response.json();
      setJogos(dados)
    }
    } catch (error) {
    console.error('Erro ao buscar jogo:', error);
  }
  };
  useEffect(() => {
      BuscarJogos();
    }, []);

  return (
    <div className='grid'>
      <div className='grid justify-items-center grid-flow-row' id='cadastro_jogo'>
        <form className='w-max p-5 bg-slate-900/95 mt-2 rounded-md' onSubmit={PesquisarJogo}>
          <input
            id="nome_jogo"
            type='text'
            required
            value= {busca}
            onChange= {(e) => setBusca(e.target.value)}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 mb-2"
          />
          <button
            type="submit"
            className="w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors cursor-pointer"
          >
            Pesquisar Jogo
          </button>
        </form>
        <div className='grid justify-items-center'>
          {carregando ? (
            <p></p>
            ) : (<div id='tabela_jogos' className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center p-2 pt-3'>
            {dados?.results?.map((jogo) => (
                <form key={jogo.id} className="w-full" onSubmit={(e) => AdicionarJogo(e, jogo)}>
                  <img loading="lazy" src={jogo.background_image} className="w-full h-50 object-cover rounded-md"></img>
                  <h3 className='text-center'>{jogo.name}</h3>
                  <p>Ano: {jogo.released}</p>
                  <p>ID API: {jogo.id}</p>
                  <button
                    type="submit"
                    className="w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors cursor-pointer"
                  >
                    Adicionar Jogo
                  </button>
                </form>
              ))}
            </div>)}
          </div>
      </div>
      <div className='grid justify-items-center' id='deletar_jogo'>
        <form className='w-max p-5 bg-slate-900/95 mt-2 rounded-md' onSubmit={DeletarJogo}>
          <input
            type='text'
            list='lista_jogos'
            value={jogoEncontrado}
            onChange={(e) => setJogoEncontrado(e.target.value)}
            required
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 mb-2"
          />
          <datalist id='lista_jogos'>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.name} />
            ))}
          </datalist>
          <button
            type="submit"
            className="w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors cursor-pointer"
          >
            Remover Jogo
          </button>
        </form>
      </div>
    </div>
  )
};