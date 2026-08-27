'use client'

import { useState} from 'react';

export default function MenuPage() {
  const [name, setName] = useState('');
  const AdicionarJogo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/jogos', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({name}),
      });
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
    }
  }
  
  return (
    <div id='div_principal'>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-xs">
          <form 
            onSubmit={AdicionarJogo} 
            action="#" 
            method="POST" 
            className="w-full max-w-sm space-y-4 rounded-xl bg-gray-800/50 p-6 backdrop-blur-md border border-white/10 shadow-xl"
          >
            <h1 style={{fontSize: '1em', textAlign: 'center'}}>Adicionar jogo</h1>
            <div>
              <label htmlFor="jogo" className="block text-sm font-medium text-gray-200 mb-1.5">
                Nome do Jogo
              </label>
              <div>
                <input
                  id="jogo"
                  type="text"
                  required
                  value= {name}
                  onChange= {(e) => setName(e.target.value)}
                  placeholder="Ex: Red Dead Redemption 2"
                  className="w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors cursor-pointer"
              >
                Adicionar Jogo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};