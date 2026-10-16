'use client'

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'
import { ObterJogo, ObterJogoInfo, AlterarDadosJogo, DeletarJogo } from '@/services/api';
import EditTagsWindow from '@/components/admin/EditTagsWindow';
import EditGenresWindow from '@/components/admin/EditGenresWindow';

export default function GamePage() {
  const router = useRouter();
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

  const AddBody = () => {
    let body = {}
    if (name != jogo?.name) {
      body.name = name
    }
    if (year != jogo?.year) {
      body.year = year
    }
    if (description != jogo?.description) {
      body.description = description
    }
    if (!areArraysEqual(genres, jogo?.genres)) {
      body.genres = genres
    }
    if (!areArraysEqual(tags, jogo?.tags)) {
      body.tags = tags
    }

    return body
  };

  const AlterarDados = async (e) => {
    e.preventDefault()

    let data = AddBody()
    if (Object.keys(data).length === 0) {
      alert("Nenhuma alteração foi realizada.");
      return;
    }

    try{
      const response = await AlterarDadosJogo(jogo.id, data);

      if(response.ok) {
        const resData = await response.json();
        const name_slug = resData.game?.name_slug;

        if (name_slug && name_slug !== pathname) {
          router.push(`/admin/games/${name_slug}`);
        } else {
          alert("Jogo atualizado com sucesso!");
          setJogo(resData.game);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar jogo:", error);
    }
  };

  const DeletarGame = async (e) => {
    e.preventDefault()

    const confirmar = window.confirm("Prosseguir com a EXCLUSÃO do jogo? *Será excluido todos os relacionamentos (notas, reviews...)");

    if (confirmar) {
      try {
        const response = await DeletarJogo(jogo.id)
        
        if(response.ok) {
          alert('Jogo deletado com sucesso.')
          router.replace('/admin/games')
        }
      } catch (error) {
        console.error("Erro ao excluir jogo:", error);
      }
    } else {
      console.log('Ação cancelada.')
      return
    }
  };

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
    <div className='relative mt-2'>
      <div className="flex items-center justify-end gap-3 z-20 mb-2">
        {hasChanges && (
          <button
            className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-all duration-200 rounded-xl px-5 py-2.5 w-fit cursor-pointer font-semibold text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            onClick={(e) => AlterarDados(e)}
          >
            Salvar mudanças
          </button>
        )}
        <button 
          className="bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 transition-all duration-200 rounded-xl px-5 py-2.5 w-fit cursor-pointer font-semibold text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          onClick={(e) => DeletarGame(e)}>
          Excluir Jogo
        </button>
      </div>
      <div className='flex flex-col mt-2 mb-2 gap-8 md:flex-row'>
        <div id='lateral' className='grow-2 flex flex-col items-center md:min-w-90 md:max-w-90 h-fit gap-2'>
          <div className='h-130 w-full center bg-cover bg-center bg-no-repeat md:w-full rounded-2xl' style={{ backgroundImage: `url(${jogo?.cover_url})`}}>
          </div>
        </div>
        <div id='principal' className='flex flex-col grow-2 h-fit gap-2'>
          <input className='text-4xl font-extrabold w-full hover:bg-primary-800/70 focus:bg-primary-800/70 rounded-xl -ml-2 pl-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500' type="text" id="title" name="title" defaultValue={jogo?.name} onChange={(e) => setName(e.target.value)}/>
          <input className='text-2xl font-semibold w-full hover:bg-primary-800/70 focus:bg-primary-800/70 rounded-xl -ml-2 pl-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500' defaultValue={jogo?.year} onChange={(e) => setYear(e.target.value)}/>
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
          <div className="bg-primary-800/30 border border-primary-700/50 h-fit p-5 rounded-2xl">
            <h2 className="text-primary-200 font-semibold text-lg uppercase tracking-wide mb-3">Desenvolvedores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {jogo?.developers?.map((dev) => (
                <p key={dev} className="text-white font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                  {dev}
                </p>
              ))}
            </div>
          </div>
          <div className='flex gap-2'>
            <h2 className='text-primary-200 font-semibold text-lg uppercase tracking-wide'>Gêneros</h2>
            <button className='text-center align-middle rounded-2xl h-fit pl-1 pr-1 bg-primary-600 hover:bg-primary-400 cursor-pointer' onClick={() => setEditGenresWindow(true)}>+</button>
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
            <button className='text-center align-middle rounded-2xl h-fit pl-1 pr-1 bg-primary-600 hover:bg-primary-400 cursor-pointer' onClick={() => setEditTagsWindow(true)}>+</button>
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
      <div className="h-fit mt-4 mb-2">
        <h2 className="text-primary-200 font-bold text-lg mb-3 uppercase tracking-wide">DESCRIÇÃO</h2>
        <textarea
          id="description"
          name="description"
          defaultValue={jogo?.description}
          placeholder="Escreva um resumo sobre o jogo..."
          className="w-full min-h-50 p-5 rounded-2xl bg-primary-800/40 border border-primary-700/50 text-white placeholder:text-primary-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-y leading-relaxed"
          onChange={(e) => setDescription(e.target.value)}
        />
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
  );
};