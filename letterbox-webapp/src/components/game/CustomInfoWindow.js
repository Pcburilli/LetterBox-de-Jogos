'use client';

import { useState, useEffect } from 'react';
import { VerificarAvaliacaoJogo, AdicionarAvaliacaoJogo } from '@/services/api';

const notas = ['', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0']

export default function CustomInfoWindow({ jogo, windowEdit, setWindowEdit, setNota }) {
    const [notaSelecionada, setNotaSelecionada] = useState('')
    const [review, setReview] = useState('')

    const [avaliacaoOriginal, setAvaliacaoOriginal] = useState('')
    const avaliacao = {nota: notaSelecionada, review: review};
    const isIgual = avaliacaoOriginal?.nota === avaliacao?.nota && avaliacaoOriginal?.review === avaliacao?.review;

    useEffect(() => {
        VerificarAvaliacaoJogo(jogo.id)
        .then((dados_avaliacao) => {
            setAvaliacaoOriginal({nota: dados_avaliacao['nota'] || '', review: dados_avaliacao['resenha']})
            setNotaSelecionada(String(dados_avaliacao['nota'] || ''));
            setReview(dados_avaliacao['resenha'] || '')
        })
      }, []);

    const AtualizarAvaliacao = async (e) => {
        e.preventDefault();

        const avaliacao_final = {
            nota: notaSelecionada,
            review: review
        };

        try {
            const response = await AdicionarAvaliacaoJogo(jogo.id, avaliacao_final);

            if (response.ok) {
                alert('Alterado com sucesso!');
                setNota(notaSelecionada)
            }
        } catch (error) {
            console.error('Falha na conexão:', error);
            alert('Erro de conexão com o servidor.');
        }

    }
    
    return (
        <div id='custom_informations' className='z-10 bg-primary-900 sm:bg-primary-800/50 fixed left-0 top-0 w-full h-screen flex flex-col justify-center items-end sm:items-center' style={{ visibility: `${windowEdit}`}}>
            <div className='flex h-1/2 w-full md:w-full rounded-2xl justify-center items-center sm:hidden'>
            <div className='h-3/4 w-2/4 bg-cover bg-center bg-no-repeat mt-10 rounded-2xl' style={{ backgroundImage: `url(${jogo?.img_url})`}}></div>
            </div>
            <div className='relative flex flex-col w-full p-3 gap-3 h-1/2 rounded-t-2xl bg-primary-700 sm:w-160 sm:h-110 sm:rounded-2xl sm:border-6 sm:border-primary-800'>
            <button className='z-1 absolute text-3xl right-0 top-0 mr-3 mt-1 text-primary-800 hover:text-primary-300 cursor-pointer' onClick={() => setWindowEdit('hidden')}>×</button>
            <h1 className='text-3xl font-bold max-w-full'>{jogo?.name}</h1>
            <div className='flex items-center justify-between overflow-x-auto overflow-y-hidden scrollbar-none w-full gap-2 py-5 sm:py-0'>
                {notas.map((nota) => {
                const isSelected = notaSelecionada === nota;
                return (<button key={nota} className={`min-w-10 min-h-10 hover:bg-primary-500 rounded-4xl font-bold cursor-pointer ${isSelected ? 'bg-primary-500' : 'bg-primary-800'}`} onClick={() => setNotaSelecionada(nota)}>
                    {nota}
                </button>
                )
                })}
            </div>
            <textarea
                placeholder="Escreva uma review..."
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                maxLength={300}
                className="w-full min-h-50 max-h-fit p-3 bg-primary-800 rounded-xl placeholder:text-primary-300 focus:outline-none scrollbar-none resize-none"
            />
            <button disabled={isIgual} className={`w-full p-3 text-primary-800 font-bold rounded-xl ${isIgual ? 'bg-gray-500 disabled:cursor-not-allowed' : 'bg-primary-300 hover:bg-primary-200 cursor-pointer'}`} onClick={(e) => AtualizarAvaliacao(e)}>Salvar</button>
            </div>
        </div>
    )
}