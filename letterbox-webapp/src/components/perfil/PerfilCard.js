'use client';
import { useState, useEffect } from 'react';
import { ObterPerfil } from '@/services/api';

const icons_user = [
  '/icons_user/icon1.png',
  '/icons_user/icon2.png',
  '/icons_user/icon3.png',
  '/icons_user/icon4.png',
  '/icons_user/icon5.png'
]

export default function PerfilCard({lenCatalogo}) {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [username, setUsername] = useState('');
  const [aba, setAba] = useState('hidden');
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    ObterPerfil()
    .then((dados) => {
      setDadosUsuario(dados);
      setUsername(dados.username || '');
      setIcon(dados.icone_url || null);
    })
    .catch((error) => console.error('Deu ruim ao carregar perfil:', error));
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

  const alternarIcone = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/register/icon', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icone_url: icon }),
        credentials: 'include'
      });

      if (response.ok) {
        await ObterPerfil();
        alert(`Icone alterado com sucesso`);
      } else {
        const erroData = await response.json();
        alert(erroData.mensagem || 'Erro ao alterar icone.');
      }
    } catch (error) {
      console.warn('Error:', error);
    }
  }

  return (
    <div id="Perfil" className="flex p-3 mb-2 bg-primary-800 rounded-2xl gap-2 w-full h-fit">
      <div className='flex relative w-40 h-25 bg-primary-900 rounded-2xl justify-center items-center'>
        <img 
          className='h-15/16'
          src={icon}>
        </img>
        <div id='alternar_icone' className='z-10 flex absolute bg-primary-800 w-6 h-6 top-0 right-0 rounded-tr-2xl rounded-bl-2xl justify-center items-center -m-0.5'>
          <button className='mt-0.5 mr-0.2 hover:text-primary-200 cursor-pointer' onClick={() => setAba('visible')}>
            +
          </button>
          <div className='absolute w-30 bg-primary-800 top-0.5 right-0.5 rounded-bl-2xl rounded-tr-2xl' style={{visibility: aba}}>
            <div className='relative mt-1.5'>
              <button className='absolute right-[5.5] top-[-7] hover:text-primary-200 cursor-pointer w-fit' onClick={() => setAba('hidden')}>
                ×
              </button>
              <div className='flex flex-wrap justify-start w-full pl-2.5 pb-1 gap-1 '>
                {icons_user.map((icon) => (
                  <img key={icon} src={icon} className='h-7 w-7 cursor-pointer' onClick={() => setIcon(icon)}></img>
                ))}
              </div>
              {dadosUsuario?.icone_url !== icon ? (
                <button className='w-full bg-primary-300 hover:bg-primary-200 text-primary-800 font-bold rounded-b-2xl transition cursor-pointer' onClick={alternarIcone}>Alterar icone</button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-row w-full'>
        <div id='username' className="flex flex-col items gap-2">
          <div className='flex flex-col gap-2'>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder=" máx. 12 caract."
              maxLength={12}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="capitalize ml-1 pl-1.5 rounded bg-primary-900 text-white focus:outline-none max-w-32"
            />

            {podeAlterar && (
              <button
                onClick={alterarUsername}
                className="bg-blue-600 hover:bg-blue-500 rounded transition cursor-pointer pl-1 pr-1 text-nowrap"
              >
                Alterar Username
              </button>
            )}
          </div>
        </div>
        <div id='info' className='flex w-full items-center justify-end p-2'>
          <div className='flex flex-col items-center justify-center'>
            <p className='w-max text-xl font-bold'>{lenCatalogo}</p>
            <p className='text-xs w-max'>Jogos</p>
          </div>
        </div>
      </div>
    </div>
  );
}