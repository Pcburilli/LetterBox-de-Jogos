'use client'

import Link from 'next/link';
import { deleteUserAction } from '@/actions/user'

export default function TableUsers({ users }) {

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
    )
}