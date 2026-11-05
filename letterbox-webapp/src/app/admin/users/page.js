
import NavBarAdmin from '@/components/admin/NavBarAdmin';
import TableUsers from '@/components/admin/users/TableUsers';
import TableReviews from '@/components/admin/users/TableReviews';

import { cookies } from 'next/headers';
import { ObterUsers, ObterReviews } from '@/services/api'

export default async function AdminPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const dados_users = await (await ObterUsers(cookieHeader).catch((error) => {
    console.error('Erro ao buscar usuários:', error);
    return null;
  })).json()

  const reviews_users = await (await ObterReviews(cookieHeader).catch((error) => {
    console.error('Erro ao buscar reviews:', error);
    return null;
  })).json()

  return (
    <div className='flex flex-col mt-2 w-full max-w-6xl gap-2'>
      <NavBarAdmin />
      <h1>Usuários</h1>
      <TableUsers users={dados_users.users}/>
      <h1>Reviews</h1>
      <TableReviews reviews={reviews_users.reviews}/>
    </div>
  )
};