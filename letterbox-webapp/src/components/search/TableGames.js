'use client'

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TableGames({ gamesData, search, PageAtual }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const jogos = gamesData.games || [];

    const TrocarPag = (NewPage) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', NewPage.toString());

      router.replace(`/search?${params.toString()}`);

    }

    const PagList = (totalStr, vizinhos = 1) => {
        const total = Number(totalStr);
        const pageAtual = Number(PageAtual);

        if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
        }

        let inicio = Math.max(1, pageAtual - vizinhos);
        let fim = Math.min(total, pageAtual + vizinhos);

        if (pageAtual <= 3) {
        inicio = 1;
        fim = 5;
        } else if (pageAtual >= total - 2) {
        inicio = total - 4;
        fim = total;
        }

        const paginas = [];

        if (inicio > 1) {
        paginas.push(1);
        if (inicio > 2);
        }

        for (let p = inicio; p <= fim; p++) {
        paginas.push(p);
        }

        if (fim < total) {
        if (fim < total - 1);
        paginas.push(total);
        }

        return paginas;
    };

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
                <button key={pag} onClick={() => TrocarPag(pag)} className='cursor-pointer text-primary-300 hover:text-primary-200'>{pag}</button>
                ))}
            </div>
        </div>
    )
}