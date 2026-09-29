'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const HandleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register/usuario', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
      });
      const resultado = await response.json();

      if (response.ok) {
        console.log('Cadastro realizado:', resultado);
        router.replace('/login')
      }
      else if (response.status === 404) {
        console.warn('Dados inválidos:', resultado);
      }
    } catch (error) {
      console.error('Falha na conexão:', error);
    }
  };

  return (
      <div className="flex flex-col min-h-full justify-center items-center px-6 py-12 lg:px-8">
        <div className='w-2/5 min-w-100 bg-primary-900 p-5 rounded-4xl border-5 border-primary-400'>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Letterbox"
              src="/icone_site.png"
              className="mx-auto h-20 w-auto"
            />
            <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-white">Registra-se e aproveite!</h2>
          </div>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={HandleRegister} action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                  E-mail
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type='email'
                    required
                    autoComplete="email"
                    value= {email}
                    onChange= {(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-400 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                    Senha
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    value= {password}
                    onChange= {(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-400 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
                >
                  Cadastrar-se
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Já é membro?{' '}
              <a href="/login" className="font-semibold text-primary-300 hover:text-primary-500">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
  )
};