'use client';
import { useState, useEffect } from 'react';

export default function PerfilPage() {
  const [nome, setNome] = useState('carregando..')
  const [catalogo, setCatalogo] = useState(null)
  console.log(catalogo)
  const [carregando, setCarregando] = useState(true)
  const ObterPerfil = async (e) => {
    try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })

    if(response.ok) {
      const dados = await response.json();
      if (dados.username === null) {
        setNome(dados.email)
      }
      else {
        setNome(dados.username)
      }
    }
    } catch (error) {
      console.error('Deu ruim:', error)
    }
  }

  useEffect(() => {
    ObterPerfil(); ObterCatalogo();
  }, []);

  const ObterCatalogo = async (e) => {
    try {
      const response = await fetch('http://localhost:5000/api/catalog', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if(response.ok) {
        const dados = await response.json();
        setCatalogo(dados)
      }
    } catch (error) {
      console.warn('Error:', error)
    } finally {
      setCarregando(false)
    }
  }
  return (
    <div>
      <h1>Perfil</h1>
      <p>Seja bem vindo: {nome}</p>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        catalogo?.map((jogo) => (
          <div key={jogo?.id} className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center p-2 pt-3'>
            <img src={jogo?.img_url} className="w-full h-50 object-cover rounded-md"/>
          </div>
        ))
      )}
    </div>
  )
};