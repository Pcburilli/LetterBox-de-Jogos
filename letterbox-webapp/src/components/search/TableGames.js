'use client'

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TableGames({ gamesData, search }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const jogos = gamesData.games || [];

    const TrocarPag = (NewPage) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', NewPage.toString());

      router.replace(`/search?${params.toString()}`);

    }

    const PagList = (total) => {
        let resultado = []
        for (let p = 1; p <= total; p++) {
            resultado.push(p)
        }
        return resultado
    }

    const totalPage = PagList(gamesData['total_page']) || [];
    
    return (
        <div>
            <h1 className='text-2xl font-medium'>Mostrando resultados para: "{search}"</h1>
            {jogos ? (
                <>
                <div className="flex flex-col items-center">
                    <div id="tabela_jogos" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full justify-items-center p-2">
                        {jogos?.map((jogo) => (
                        <div key={jogo?.id || jogo?.name} className="relative w-full flex flex-col items-center rounded-3xl">
                            <Link href={`/games/${jogo?.name_slug}`}>
                            <div className='absolute opacity-0 hover:opacity-100 flex items-end justify-center bg-primary-900/50 border-2 border-primary-300 left-0 top-0 w-full h-full object-cover rounded-3xl text-center transition-opacity'>
                                <div>
                                <p className='p-2 font-semibold text-xl'>{jogo.name}</p>
                                </div>
                            </div>
                            <img
                                src={jogo?.cover_url} 
                                alt={jogo?.name} 
                                className="w-full h-48 object-cover rounded-3xl"
                            />
                            </Link>
                        </div>
                        ))}
                    </div>
                </div>
                </>
            ) : (
                <h1>Nenhum resultado.</h1>
            )}
            <div className='flex justify-center gap-3'>
                {totalPage?.map((pag) => (
                <button key={pag} onClick={() => TrocarPag(pag)} className='text-2xl cursor-pointer text-primary-300 hover:text-primary-200'>●</button>
                ))}
            </div>
        </div>
    )
}