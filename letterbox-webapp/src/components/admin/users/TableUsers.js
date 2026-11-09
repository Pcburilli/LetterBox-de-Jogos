'use client'

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteUserAction } from '@/actions/user'

export default function TableUsers({ users, totalPage, PageAtual }) {

    const searchParams = useSearchParams();
    const router = useRouter();

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
    
    const TrocarPage = (NewPage) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set('page_users', NewPage.toString());

        router.replace(`/admin/users?${params.toString()}`);
    }

    const DeletarUsuario = async (e, id) => {
        e.preventDefault();

        const confirmar = window.confirm("Prosseguir com a EXCLUSÃO do usuário? *Será excluido todos os relacionamentos (notas, reviews...)");

        if (confirmar) {
            const result = await deleteUserAction(id)
            if (result.success) {
                alert('Usuário deletado com sucesso.')
            } else if (result.status === 403) {
                alert('Usuário é administrador.')
            } else {
                alert(result.error || 'Erro ao excluir usuário.')
            }
        } else {
            console.log('Ação cancelada.')
            return
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='w-full flex flex-wrap justify-center gap-2'>
                {users?.map((user) => (
                    <div key={user?.id} className='flex flex-col gap-1 w-40 h-fit p-2 bg-primary-800 rounded-2xl'>
                        <div className='flex gap-1 items-center'>
                            <Link href={`/users/${user?.username}`}><img src={user?.icon_url} className='w-8 h-8 hover:bg-primary-700 rounded-2xl' /></Link>
                            <h1 className='capitalize'>{user?.username}</h1>
                        </div>
                        <div className='flex w-full justify-center'>
                            <button className='w-full bg-red-700 hover:bg-red-900 rounded-2xl p-1 text-sm font-semibold cursor-pointer' onClick={(e) => DeletarUsuario(e, user?.id)}>Excluir usuário</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-center gap-3'>
            {PagList(totalPage)?.map((pag) => (
                <button key={pag} onClick={() => TrocarPage(pag)} className='cursor-pointer text-primary-300 hover:text-primary-200'>{pag}</button>
            ))}
            </div>
        </div>
    )
}