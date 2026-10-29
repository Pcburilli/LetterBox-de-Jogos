'use client';

import { useRouter } from 'next/navigation';
import { FazerLogin } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();

  const HandleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target)
    const dados = Object.fromEntries(formData)

    try {
      const result = await FazerLogin(dados)

      if (result.ok) {
        router.refresh(); 
        router.replace('/users')
      }
      else if (result.status === 401) {
        alert('Dados incorretos ou não cadastrado.');
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
            alt="StockG"
            src="/icone_site.png"
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-white">Seja bem-vindo!</h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">

          <form onSubmit={HandleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-100">
                Username
              </label>
              <div className="mt-2">
                <input
                  name='username'
                  type='text'
                  required
                  autoComplete="username"
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
                  name='password'
                  id="password"
                  type="password"
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
                Entrar
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Não é membro?{' '}
            <a href="/register" className="font-semibold text-primary-300 hover:text-primary-500">
              Registre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  )
};