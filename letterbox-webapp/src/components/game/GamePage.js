'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { ObterJogo, adicionarAoCatalogo, VerificarJogoCatalogo, AlterarStatusJogo } from '@/services/api';

const status_names = ['Na Fila', 'Jogando', 'Zerado', 'Abandonado']

export default function GamePage({ isLoggedIn }) {
  const pathname = usePathname().slice(7)
  const [jogo, setJogo] = useState(null)
  // STATUS
  const [statusJogo, setStatusJogo] = useState(null)
  const [statusJogoOriginal, setStatusJogoOriginal] = useState(null)
  const [windowStatus, setWindowStatus] = useState('hidden')
  // TAGS
  const [lenTags, setLenTags] = useState(5)
  const [buttonTags, setButtonTags] = useState('+')

  useEffect(() => {
    ObterJogo(pathname)
    .then((dadosJogo) => {
      setJogo(dadosJogo);
      if (isLoggedIn && dadosJogo?.id) {
        VerificarJogoCatalogo(dadosJogo.id)
        .then((dados) => {
          setStatusJogo(dados.status)
          setStatusJogoOriginal(dados.status)
        })
        .catch((error) => console.error('Erro na verificação:', error))
      }
    })
    .catch((error) => console.error('Erro ao buscar jogo:', error));
  }, [pathname]);

  const AdicionarJogo = async (e) => {
    e.preventDefault();
    try {
      const response = await adicionarAoCatalogo(jogo.id);

      if (response.ok) {
        alert('Registro realizado.');
      } else if (response.status === 401) {
        alert('Precisa estar logado.');
      } else if (response.status === 409) {
        alert('Jogo já cadastrado.');
      }
    } catch (error) {
      console.error('Falha na conexão:', error);
    } finally {
      VerificarJogoCatalogo(jogo.id).then((dados) => setStatusJogo(dados.status))
    }
  };

  const AlterarStatus = async (e) => {
    e.preventDefault();
    if (statusJogoOriginal === statusJogo) {
       alert('Status Igual ao atual.')
       return;
    }
    try {
      const response = await AlterarStatusJogo(jogo.id, statusJogo);

      if (response.ok) {
        alert('Alterado com sucesso!');
        setStatusJogoOriginal(statusJogo)
        setWindowStatus('hidden')
      } else if (response.status === 409) {
        alert('Status Igual ao atual.')
      }
    } catch (error) {
      console.error('Falha na conexão:', error);
      alert('Erro de conexão com o servidor.');
    }
  }

  const LimitTags = async () => {
    if (buttonTags === '+') {
      setLenTags(jogo.tags.length)
      setButtonTags('-')
    } else {
      setLenTags(5)
      setButtonTags('+')
    }
  }

  const AdjustWindowStatus = async () => {
    if (windowStatus == 'hidden') {
      setWindowStatus('visible')
    } else {
      setWindowStatus('hidden')
    }
  }

  if (!jogo) {
    return <p className='w-full text-center'>Carregando...</p>;
  }
  return (
    <div>
      <div className='flex flex-col mt-8 mb-2 gap-8 md:flex-row'>
        <div id='lateral' className='grow-2 flex flex-col items-center md:min-w-90 md:max-w-90 h-fit gap-2'>
          <div className='h-130 w-full center bg-cover bg-center bg-no-repeat md:w-full rounded-2xl' style={{ backgroundImage: `url(${jogo?.img_url})`}}></div>
          {isLoggedIn ? (
            statusJogo ? (
              <div className='w-full flex gap-1 relative'>
                <div className={`absolute flex flex-col w-[calc(87.5%-3.5px)] h-60 rounded-3xl -top-50 bg-primary-800 gap-2 transition-all duration-300 ${windowStatus === 'visible' ? 'opacity-100' : 'opacity-0'}`} style={{ visibility: `${windowStatus}`}}>
                  <button className='p-1 bg-primary-300 hover:bg-primary-200 text-primary-900 font-bold rounded-t-2xl cursor-pointer' onClick={(e) => AlterarStatus(e)}>Alterar Status</button>
                  {status_names.map((st) => (
                    <button key={st} className='p-1 bg-primary-700 hover:bg-primary-500 rounded-xl ml-8 mr-8 cursor-pointer' onClick={() => setStatusJogo(st)}>{st}</button>
                  ))}
                </div>
                <button className='z-1 bg-primary-300 hover:bg-primary-200 text-primary-900 w-7/8 rounded-3xl p-2 font-bold cursor-pointer' onClick={() => AdjustWindowStatus()}>
                {statusJogo}
                </button>
                <button className='bg-primary-700 hover:bg-primary-500 w-1/8 rounded-2xl cursor-pointer'>⋮</button>
              </div>
            ) : (
              <button className='bg-primary-700 hover:bg-primary-500 text-primary-900 w-full rounded-3xl p-2 font-bold cursor-pointer' onClick={(e) => AdicionarJogo(e)}>
                + Adicionar Jogo
              </button>
            )
          ) : null}
        </div>
        <div id='principal' className='flex flex-col grow-2 h-fit gap-2'>
          <h1 className='text-4xl font-bold'>{jogo?.name}</h1>
          <p className='text-2xl text-primary-200'>{jogo?.ano}</p>
          <div className='w-full h-fit rounded-2xl flex gap-2 flex-wrap'>
            <div className='min-h-18 min-w-20 rounded-2xl text-center p-2 border'>nota</div>
            <div className='min-h-18 min-w-20 rounded-2xl text-center p-2 border'>jogando</div>
            <div className='min-h-18 min-w-20 rounded-2xl text-center p-2 border'>zerado</div>
            <div className='min-h-18 min-w-20 rounded-2xl text-center p-2 border'>na fila</div>
            <div className='min-h-18 min-w-20 rounded-2xl text-center p-2 border'>abandonado</div>
            <div className='min-h-18 min-w-20 rounded-2xl text-center p-2 border'>reviews</div>
          </div>
          <div className='bg-primary-600 h-fit p-3 rounded-2xl'>
            <h2 className='text-primary-200 font-bold text-2xl mt-2'>Desenvolvedores</h2>
            <div className='grid grid-cols-2'>
              {jogo?.desenvolvedores?.map((dev) => (
                <p key={dev}>{dev}</p>
              ))}
            </div>
          </div>
          <h2 className='font-bold text-2xl'>Tags</h2>
          <div className='flex flex-wrap gap-2 justify-normal'>
            {jogo?.tags?.slice(0,lenTags).map((tag) => (
              <p key={tag} className='border rounded-2xl p-1 pr-2 pl-2 text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200'>{tag}</p>
            ))}
            <button className='bg-primary-700 hover:bg-primary-500 border rounded-2xl p-1 pr-2 pl-2 text-center h-fit w-8 whitespace-nowrap text-primary-200 cursor-pointer' onClick={() => LimitTags()}>{buttonTags}</button>
          </div>
          {isLoggedIn ? (
            statusJogo ? (
              <div className='bg-primary-600 w-full h-20 rounded-2xl p-3'>
                NOTA
              </div>
            ) : (
              null
            )
          ) : null}
        </div>
      </div>
      <div className='h-fit mb-2'>
        <h2 className='font-bold text-2xl'>Resumo</h2>
        <p className='text-justify text-primary-200'>
          {jogo?.description}
        </p>
      </div>
    </div>
  );
};