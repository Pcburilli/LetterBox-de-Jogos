'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { deletarGameAction } from '@/actions/gameAdmin';

export default function TableGames({jogos, totalPage}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const PagList = (total) => {
    let resultado = []
    for (let p = 1; p <= total; p++) {
        resultado.push(p)
    }
    return resultado  
    }
    
    const TrocarPage = (NewPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', NewPage.toString());

    router.replace(`/admin/games?${params.toString()}`);

    }

    const DeletarGame = async (e, game_id) => {
    e.preventDefault()
    console.log(game_id)

    const confirmar = window.confirm("Prosseguir com a EXCLUSÃO do jogo? *Será excluido todos os relacionamentos (notas, reviews...)");

    if (confirmar) {
        const result = await deletarGameAction(game_id)
        
        if(result.success) {
            alert('Jogo deletado com sucesso.')
        } else {
            alert(result.error || 'Erro ao excluir jogo.')
        }
    } else {
        console.log('Ação cancelada.')
        return
    }
    };
    
    return (
        <div id="tabela_jogos" className="flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full justify-items-center">
                {jogos?.map((jogo) => (
                <div key={jogo?.id || jogo?.name} className="relative w-full flex flex-col items-center rounded-3xl">
                    <button className='absolute z-1 right-2 top-2 bg-red-700 rounded-2xl border-2 border-primary-900 pr-2 pl-2 font-bold hover:bg-red-800 cursor-pointer' onClick={(e) => DeletarGame(e, jogo.id)}>x</button>
                    <a href={`/admin/games/${jogo?.name_slug}`}>
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
                    </a>
                </div>
                ))
                }
            </div>

            <div className='flex justify-center gap-3'>
            {PagList(totalPage)?.map((pag) => (
                <button key={pag} onClick={() => TrocarPage(pag)} className='text-2xl cursor-pointer text-primary-300 hover:text-primary-200'>●</button>
            ))}
            </div>
        </div>
    )
}