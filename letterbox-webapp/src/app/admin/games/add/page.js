'use client'

import { useState, useEffect } from 'react';
import NavBarAdmin from '@/components/admin/NavBarAdmin';
import EditTagsWindow from '@/components/admin/EditTagsWindow';
import EditGenresWindow from '@/components/admin/EditGenresWindow';

export default function AddGamePage() {
  // Busca API
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState('');

  // Adicionar Manualmente
  const [name, setName] = useState(null)
  const [year, setYear] = useState(null)
  const [description, setDescription] = useState(null)
  const [genres, setGenres] = useState([])
  const [tags, setTags] = useState([])

  // Janelas EditGenres e EditTags
  const [editGenresWindow, setEditGenresWindow] = useState(false)
  const [editTagsWindow, setEditTagsWindow] = useState(false)

  const PesquisarJogo = async (e) => {
    e.preventDefault()
    const key_RAWG = 'bf7ce09f1afa45a4b7fb51ac39492f01'

    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${key_RAWG}&search=${busca}&stores=1,2,3,5,6,11`)

      if (response.ok) {
        const resultado = await response.json();
        if (resultado['count'] > 0) {
          setDados(resultado);
        } else {
          setDados([])
        }
      }
    } catch(error) {
      console.error('Erro na pesquisa:', error);
    } finally {
      setCarregando(true);
    }
  }

  const PesquisarJogoID = async (jogoid) => {
    const key_RAWG = 'bf7ce09f1afa45a4b7fb51ac39492f01'

    try {
      const response = await fetch(`https://api.rawg.io/api/games/${jogoid}?key=${key_RAWG}`)

      if (response.ok) {
        const resultado = await response.json();
        return resultado
      }
    } catch(error) {
      console.error('Erro na pesquisa:', error);
    }
  }

  const AdicionarJogo = async (e, jogo) => {
    e.preventDefault();

    try {
      const jogo_response = await PesquisarJogoID(jogo.id)
      console.log('Dados do Jogo obtidos do RAWG:', jogo_response);

      const response = await fetch('http://localhost:5000/api/games/', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(jogo_response),
        credentials: 'include'
      });
      const resultado = await response.json();

      if (response.ok) {
        alert('Registro realizado.')
        console.log('Registro realizado:', resultado);
      }
      else if (response.status === 409) {
        alert('Jogo já cadastrado.')
        console.warn('Erro:', resultado);
      }
      else if (response.status === 403 || 401) {
        alert('Somente Admins.')
        console.warn('Erro:', resultado);
      }
    } catch (error) {
      console.error('Falha na conexão:', error);
    }
  }

  const AddBody = () => {
    let body = {}
      body.name = name
      body.year = year
      body.description = description
      body.genres = genres
      body.tags = tags

    return body
  };

  return (
    <div className='flex flex-col place-items-center mt-2 w-full max-w-6xl mx-auto gap-2'>
      <NavBarAdmin/>
      <div className='w-full h-fit bg-primary-700 rounded-2xl p-2'>

        <div className='flex flex-col sm:flex-row gap-2'>
          <div id='lateral' className='flex flex-col items-center min-w-60 h-fit gap-2'>
            <div className='h-100 w-full center bg-cover bg-center bg-no-repeat md:w-full rounded-2xl bg-primary-800/50 hover:bg-primary-800/70'>
          </div>
        </div>

          <div id='principal' className='flex flex-col grow-2 h-fit gap-2'>
            <input className='text-4xl font-extrabold w-full hover:bg-primary-800/70 focus:bg-primary-800/70 rounded-xl l pl-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500' type="text" id="title" name="title" placeholder='Nome*' onChange={(e) => setName(e.target.value)}/>
            <input className='text-2xl font-semibold w-full hover:bg-primary-800/70 focus:bg-primary-800/70 rounded-xl pl-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500'
            placeholder='Data de Lançamento (Ex: 2000-01-31)' onChange={(e) => setYear(e.target.value)}/>
            
            <div className='flex gap-2'>
              <h2 className='text-primary-200 font-semibold text-lg uppercase tracking-wide'>Gêneros</h2>
              <button className='text-center align-middle rounded-2xl h-fit pl-1 pr-1 bg-primary-800 hover:bg-primary-800/70 cursor-pointer' onClick={() => setEditGenresWindow(true)}>+</button>
            </div>
            <div className='flex flex-wrap gap-2 justify-normal'>
              {genres?.map((genre) => (
                <div key={genre} className='flex border rounded-2xl text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200 gap-2 align-middle justify-center p-1 pl-2 pr-2'>
                  <p>{genre}</p>
                </div>
              ))}
            </div>

            <div className='flex gap-2'>
              <h2 className='text-primary-200 font-semibold text-lg uppercase tracking-wide'>Tags</h2>
              <button className='text-center align-middle rounded-2xl h-fit pl-1 pr-1 bg-primary-800 hover:bg-primary-800/70 cursor-pointer' onClick={() => setEditTagsWindow(true)}>+</button>
            </div>
            <div className='flex flex-wrap gap-2 justify-normal'>
              {tags?.map((tag) => (
                <div key={tag} className='flex border rounded-2xl text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200 gap-2 align-middle justify-center p-1 pl-2 pr-2'>
                  <p>{tag}</p>
                </div>
              ))}
            </div>

            <div className="h-fit mt-4 mb-2">
              <h2 className="text-primary-200 font-bold text-lg mb-3 uppercase tracking-wide">DESCRIÇÃO</h2>
              <textarea
                id="description"
                name="description"
                placeholder="Escreva um resumo sobre o jogo..."
                className="w-full min-h-42 p-5 rounded-2xl bg-primary-800/40 border border-primary-700/50 text-white placeholder:text-primary-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none leading-relaxed"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

          </div>
        </div>
      </div>

      <h1 className='flex justify-center w-full bg-primary-700 rounded-2xl p-2 font-bold gap-1'>Adicionar via<p className='bg-black pl-1 pr-1 rounded-xl'>API RAWG</p></h1>
      <div id='tabela_jogos' className='grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 justify-items-center p-2'>
        <form className='flex flex-col justify-between w-full h-22.5 gap-2 p-1 rounded-xl border-2 border-primary-300' onSubmit={PesquisarJogo}>
          <input
            id="nome_jogo"
            placeholder='Escreva o nome do jogo...'
            type='text'
            required
            value= {busca}
            onChange= {(e) => setBusca(e.target.value)}
            className="block w-full rounded-md bg-primary-500/30 focus:bg-primary-500/45 px-3 py-1 text-base outline-0"
          />
          <button
            type="submit"
            className="w-full justify-center rounded-md bg-primary-300 hover:bg-primary-200 text-primary-800 font-bold cursor-pointer"
          >
            Pesquisar Jogo
          </button>
        </form>
        {carregando && (
          dados?.results?.map((jogo) => (
            <form key={jogo?.id} className="flex w-full gap-2 p-1 rounded-xl border-2 border-primary-600" onSubmit={(e) => AdicionarJogo(e, jogo)}>
              <img loading="lazy" src={jogo?.background_image} className="w-15 h-20 object-cover rounded-md"></img>
              <div className='flex flex-col w-full justify-between'>
                <h3 className='text-center text-sm'>{jogo?.name}</h3>
                <button
                  type="submit"
                  className="w-full justify-center rounded-md bg-primary-700 hover:bg-primary-400 cursor-pointer"
                >
                  Adicionar Jogo
                </button>
              </div>
            </form>
          ))
        )}
      </div>
      {editTagsWindow && (
        <div className='fixed flex z-10 p-2 left-0 top-0 w-full h-screen bg-primary-800/50 justify-center items-center backdrop-blur-sm'>
          <EditTagsWindow setEditTagsWindow={setEditTagsWindow} tags={tags} setTags={setTags}/>
        </div>
      )}
      {editGenresWindow && (
        <div className='fixed flex z-10 p-2 left-0 top-0 w-full h-screen bg-primary-800/50 justify-center items-center backdrop-blur-sm'>
          <EditGenresWindow setEditGenresWindow={setEditGenresWindow} genres={genres} setGenres={setGenres}/>
        </div>
      )}
    </div>
  )
};