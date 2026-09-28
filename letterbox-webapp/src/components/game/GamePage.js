'use client'

import { useState, useEffect } from 'react';
import { usePathname, useRouter} from 'next/navigation'

export default function GamePage({ isLoggedIn }) {
  const router = useRouter();
  const pathname = usePathname().slice(7)
  const [jogo, setJogo] = useState(null)
  
  const BuscarJogo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/jogos/${pathname}`);

      if (response.ok) {
        const dados = await response.json();
        setJogo(dados)
      }
      } catch (error) {
      console.error('Erro ao buscar jogo:', error);
    }
  };

  const AdicionarJogo = async (e, jogo) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/catalog/add', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({'id_jogo':jogo.id}),
        credentials: 'include'
      });
      const resultado = await response.json();

      if (response.ok) {
        alert('Registro realizado.')
        console.log('Registro realizado:', resultado);
      }
      else if (response.status === 401) {
        alert('Precisa estar logado.')
        console.warn('Erro:', resultado);
        router.replace('/login')
      }
      else if (response.status === 409) {
        alert('Jogo já cadastrado.')
        console.warn('Erro:', resultado);
      }
    } catch (error) {
      console.error('Falha na conexão:', error);
    }
  }

  useEffect(() => {
    BuscarJogo();
  }, [pathname]);

  if (!jogo) {
    return <p className='w-full text-center'>Carregando...</p>;
  }
  return (
    <div>
      <div className='flex flex-col mt-8 mb-2 gap-8 md:flex-row'>
        <div id='lateral' className='grow-2 flex flex-col items-center md:min-w-90 md:max-w-90 h-fit gap-2'>
          <div className='h-130 w-full center bg-cover bg-center bg-no-repeat md:w-full rounded-2xl' style={{ backgroundImage: `url(${jogo?.img_url})`}}></div>
          {isLoggedIn ? (
            <button className='bg-primary-700 hover:bg-primary-500 text-primary-900 text w-full rounded-3xl p-2 font-bold cursor-pointer' onClick={(e) => {AdicionarJogo(e, jogo)}}>+ Adicionar Jogo</button>
          ) : (
            <></>
          )}
        </div>
        <div id='principal' className='flex flex-col grow-2 h-fit gap-2'>
          <h1 className='text-4xl font-bold'>{jogo?.name}</h1>
          <p className='text-2xl text-primary-200'>{jogo?.ano}</p>
          <h2 className='font-bold text-2xl'>Tags</h2>
          <div className='flex flex-wrap gap-2 justify-between'>
            {jogo?.tags?.map((tag) => (
              <p key={tag} className='border rounded-2xl p-1 pr-2 pl-2 text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200'>{tag}</p>
            ))}
          </div>
          <div className='bg-primary-600 h-fit p-3 rounded-2xl'>
            <h2 className='text-primary-200 font-bold text-2xl mt-2'>Desenvolvedores</h2>
            <div className='grid grid-cols-2'>
              {jogo?.desenvolvedores?.map((dev) => (
                <p key={dev}>{dev}</p>
              ))}
            </div>
          </div>
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