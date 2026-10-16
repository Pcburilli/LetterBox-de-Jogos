'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { ObterJogo, ObterJogoInfo } from '@/services/api';
import EditTagsWindow from '@/components/admin/EditTagsWindow';
import EditGenresWindow from '@/components/admin/EditGenresWindow';

export default function GamePage() {
  const pathname = usePathname().slice(13)
  const [jogo, setJogo] = useState(null)

  // estatisticas sobre o jogo
  const [infoGame, setInfoGame] = useState(null)

  // Alteração do game
  const [name, setName] = useState(null)
  const [year, setYear] = useState(null)
  const [description, setDescription] = useState(null)
  const [genres, setGenres] = useState([])
  const [tags, setTags] = useState([])

  // Janelas EditGenres e EditTags
  const [editGenresWindow, setEditGenresWindow] = useState(false)
  const [editTagsWindow, setEditTagsWindow] = useState(false)

  // comparar se dois arrays são iguais para verificar se há alterações
  const areArraysEqual = (arr1 = [], arr2 = []) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
  };

  const isPristine = 
    name === jogo?.name &&
    year === jogo?.year &&
    description === jogo?.description &&
    areArraysEqual(genres, jogo?.genres) &&
    areArraysEqual(tags, jogo?.tags);

  const hasChanges = !isPristine; 

  useEffect(() => {
    ObterJogo(pathname)
    .then((dadosJogo) => {
      setJogo(dadosJogo);
      setName(dadosJogo.name);
      setYear(dadosJogo.year);
      setDescription(dadosJogo.description);
      setTags(dadosJogo.tags);
      setGenres(dadosJogo.genres)
    })
    .catch((error) => console.error('Erro ao buscar jogo:', error));

    ObterJogoInfo(pathname).then((dados) => {
      setInfoGame(dados);
    }).catch((error) => console.error('Erro ao buscar estatística do jogo:', error));
  }, [pathname]);

  if (!jogo) {
    return <p className='w-full text-center'>Carregando...</p>;
  }
  return (
    <div className='relative p-4 sm:p-6'>
      <div className='flex items-center justify-end gap-3 z-20'>
        {hasChanges && (
          <button className='bg-green-600 hover:bg-green-800 rounded-2xl p-2 w-fit cursor-pointer font-bold'>Salvar mudanças</button>
        )}
        <button className='bg-red-600 hover:bg-red-800 rounded-2xl p-2 w-fit cursor-pointer font-bold'>Excluir Jogo</button>
      </div>
      <div className='flex flex-col mt-2 mb-2 gap-8 md:flex-row'>
        <div id='lateral' className='grow-2 flex flex-col items-center md:min-w-90 md:max-w-90 h-fit gap-2'>
          <div className='h-130 w-full center bg-cover bg-center bg-no-repeat md:w-full rounded-2xl' style={{ backgroundImage: `url(${jogo?.cover_url})`}}>
          </div>
        </div>
        <div id='principal' className='flex flex-col grow-2 h-fit gap-2'>
          <input className='text-4xl font-bold max-w-110' type="text" id="title" name="title" defaultValue={jogo?.name} onChange={(e) => setName(e.target.value)}/>
          <input className='text-2xl text-primary-200 max-w-110' defaultValue={jogo?.year} onChange={(e) => setYear(e.target.value)}/>
          <div className='w-full h-fit rounded-2xl grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2'>
            <div className='min-h-18 min-w-28 rounded-2xl text-center p-2 border text-primary-200 font-bold'>
              <p>{infoGame?.media_rate ?? 0}</p>
              <p>Nota</p>
            </div>
            <div className='min-h-18 min-w-28 rounded-2xl text-center p-2 border text-primary-200 font-bold'>
              <p>{infoGame?.na_fila ?? 0}</p>
              <p>Na Fila</p>
            </div>
            <div className='min-h-18 min-w-28 rounded-2xl text-center p-2 border text-primary-200 font-bold'>
              <p>{infoGame?.jogando ?? 0}</p>
              <p>Jogando</p>
            </div>
            <div className='min-h-18 min-w-28 rounded-2xl text-center p-2 border text-primary-200 font-bold'>
              <p>{infoGame?.zerado ?? 0}</p>
              <p>Zerado</p>
            </div>
            <div className='min-h-18 min-w-28 rounded-2xl text-center p-2 border text-primary-200 font-bold'>
              <p>{infoGame?.abandonado ?? 0}</p>
              <p>Abandonado</p>
            </div>
            <div className='min-h-18 min-w-28 rounded-2xl text-center p-2 border text-primary-200 font-bold'>
              <p>{infoGame?.quantity_review ?? 0}</p>
              <p>Reviews</p>
            </div>
          </div>
          <div className='bg-primary-600 h-fit p-3 rounded-2xl'>
            <h2 className='text-primary-200 font-bold text-2xl mt-2'>Desenvolvedores</h2>
            <div className='grid grid-cols-2'>
              {jogo?.developers?.map((dev) => (
                <p key={dev}>{dev}</p>
              ))}
            </div>
          </div>
          <div className='flex gap-2'>
            <h2 className='font-bold text-2xl'>Gêneros</h2>
            <button className='text-center align-middle rounded-2xl h-fit mt-1 pl-1 pr-1 bg-primary-600 hover:bg-primary-400 cursor-pointer' onClick={() => setEditGenresWindow(true)}>+</button>
          </div>
          <div className='flex flex-wrap gap-2 justify-normal'>
            {genres?.map((genre) => (
              <div key={genre} className='flex border rounded-2xl text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200 gap-2 align-middle justify-center p-1 pl-2 pr-2'>
                <p>{genre}</p>
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <h2 className='font-bold text-2xl'>Tags</h2>
            <button className='text-center align-middle rounded-2xl h-fit mt-1 pl-1 pr-1 bg-primary-600 hover:bg-primary-400 cursor-pointer' onClick={() => setEditTagsWindow(true)}>+</button>
          </div>
          <div className='flex flex-wrap gap-2 justify-normal'>
            {tags?.map((tag) => (
              <div key={tag} className='flex border rounded-2xl text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200 gap-2 align-middle justify-center p-1 pl-2 pr-2'>
                <p>{tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='h-fit mb-2'>
        <h2 className='font-bold text-2xl'>Resumo</h2>
        <textarea
          type="text"
          id="description" 
          name="description"
          defaultValue={jogo?.description}
          className="w-full min-h-50 max-h-fit p-3 placeholder:text-primary-300 focus:outline-none scrollbar-none resize-none"
          onChange={(e) => setDescription(e.target.value)}>
        </textarea>
      </div>
      {editTagsWindow && (
        <div className='fixed flex z-10 p-2 left-0 top-0 w-full h-screen bg-primary-800/50 justify-center items-center'>
          <EditTagsWindow setEditTagsWindow={setEditTagsWindow} tags={tags} setTags={setTags}/>
        </div>
      )}
      {editGenresWindow && (
        <div className='fixed flex z-10 p-2 left-0 top-0 w-full h-screen bg-primary-800/50 justify-center items-center'>
          <EditGenresWindow setEditGenresWindow={setEditGenresWindow} genres={genres} setGenres={setGenres}/>
        </div>
      )}
    </div>
  );
};