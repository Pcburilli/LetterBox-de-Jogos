'use client'

import { useState } from 'react';
import { addGameAction } from '@/actions/gameAdmin';

export default function AddGameRAWG() {
    // Busca API
    const [carregando, setCarregando] = useState(false);
    const [dados, setDados] = useState([]);
    const [busca, setBusca] = useState('');

    const PesquisarJogo = async (e) => {
        e.preventDefault()
        const key_RAWG = 'bf7ce09f1afa45a4b7fb51ac39492f01'

        try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${key_RAWG}&search=${busca}&stores=1,2,3,5,6,11`)

        if (response.ok) {
            const resultado = await response.json();
            if (resultado['count'] > 0) {
            setDados(resultado);
            } else {
            setDados([])
            }
        }
        } catch(error) {
        console.error('Erro na pesquisa:', error);
        } finally {
        setCarregando(true);
        }
    }

    const PesquisarJogoID = async (jogoid) => {
        const key_RAWG = 'bf7ce09f1afa45a4b7fb51ac39492f01'

        try {
        const response = await fetch(`https://api.rawg.io/api/games/${jogoid}?key=${key_RAWG}`)

        if (response.ok) {
            const resultado = await response.json();
            return resultado
        }
        } catch(error) {
        console.error('Erro na pesquisa:', error);
        }
    }

    const AdicionarJogo = async (e, jogo) => {
        e.preventDefault()
        const dados_jogo = await PesquisarJogoID(jogo.id);
        dados_jogo.source = 'rawg';
        
        try {
        const result = await addGameAction(dados_jogo)

        if (result.success) {
            alert('Registro realizado.')
            console.log('Registro realizado:', result);
        }
        else if (result.status === 409) {
            alert('Jogo já cadastrado.')
            console.warn('Erro:', result);
        }

        } catch (error) {
            console.error('Falha na conexão:', error);
        }
    }

    return (
        <div id='tabela_jogos' className='grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 justify-items-center p-2'>
            <form className='flex flex-col justify-between w-full h-22.5 gap-2 p-1 rounded-xl border-2 border-primary-300' onSubmit={PesquisarJogo}>
                <input
                    id="nome_jogo"
                    placeholder='Escreva o nome do jogo...'
                    type='text'
                    required
                    value= {busca}
                    onChange= {(e) => setBusca(e.target.value)}
                    className="block w-full rounded-md bg-primary-500/30 focus:bg-primary-500/45 px-3 py-1 text-base outline-0"
                />
                <button
                    type="submit"
                    className="w-full justify-center rounded-md bg-primary-300 hover:bg-primary-200 text-primary-800 font-bold cursor-pointer"
                >
                    Pesquisar Jogo
                </button>
            </form>
            {carregando && (
            dados?.results?.map((jogo) => (
                <form key={jogo?.id} className="flex w-full gap-2 p-1 rounded-xl border-2 border-primary-600" onSubmit={(e) => AdicionarJogo(e, jogo, 'rawg')}>
                    <img loading="lazy" src={jogo?.background_image} className="w-15 h-20 object-cover rounded-md"></img>
                    <div className='flex flex-col w-full justify-between'>
                        <h3 className='text-center text-sm'>{jogo?.name}</h3>
                        <button
                        type="submit"
                        className="w-full justify-center rounded-md bg-primary-700 hover:bg-primary-400 cursor-pointer"
                        >
                        Adicionar Jogo
                        </button>
                    </div>
                </form>
            ))
            )}
        </div>
    )
}