'use client';
import { useState, useEffect } from 'react';

const icons_user = [
  '/icons_user/icon1.png',
  '/icons_user/icon2.png',
  '/icons_user/icon3.png',
  '/icons_user/icon4.png',
  '/icons_user/icon5.png'
]

export default function PerfilCard() {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [username, setUsername] = useState('');
  const [aba, setAba] = useState('hidden');
  const [icon, setIcon] = useState(null)

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
        setIcon(dados?.icone_url || null)
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
    <div id="Perfil" className="flex flex-col p-3 m-2 bg-primary-800 rounded-2xl gap-2 w-fit">
      <div className='flex relative w-full h-50 bg-primary-900 rounded-2xl justify-center items-center'>
        <img 
          className='h-15/16'
          src={icon}>
        </img>
        <div className='flex absolute bg-primary-800 w-6 h-6 top-0 right-0 rounded-tr-2xl rounded-bl-2xl justify-center items-center -m-0.5'>
          <button className='mt-0.5 mr-0.2 hover:text-primary-200 cursor-pointer' onClick={() => setAba('visible')}>
            +
          </button>
          <div className='absolute w-30 bg-primary-800 top-0.5 -right-24 rounded-b-2xl rounded-tr-2xl' style={{visibility: aba}}>
            <div className='relative mt-1.5'>
              <button className='absolute left-[7.3] top-[-7] hover:text-primary-200 cursor-pointer' onClick={() => setAba('hidden')}>
                ×
              </button>
              <div className=' grid grid-cols-3 w-full pr-1 pl-5 pb-1 gap-1'>
                {icons_user.map((icon) => (
                  <img key={icon} src={icon} className='h-7 w-7' onClick={() => setIcon(icon)}></img>
                ))}
              </div>
              {dadosUsuario?.icone_url !== icon ? (
                <button className='w-full bg-blue-600 hover:bg-blue-500 rounded-b-2xl transition cursor-pointer' onClick={alternarIcone}>Alterar icone</button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <label htmlFor="nome" className="flex items-center">
        Username:
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder=" máx. 12 caract."
          maxLength={12}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="capitalize ml-1 rounded bg-slate-800 text-white focus:outline-none max-w-32"
        />
      </label>

      {podeAlterar && (
        <button
          onClick={alterarUsername}
          className="bg-blue-600 hover:bg-blue-500 rounded transition cursor-pointer"
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