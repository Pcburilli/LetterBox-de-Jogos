
import NavBarAdmin from '@/components/admin/NavBarAdmin';
import DashBoard from '@/components/admin/DashBoard/DashBoard';
import { ObterDashboard } from '@/services/api';
import { cookies } from 'next/headers';

export default async function AdminPage() {

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const data = await ObterDashboard(cookieHeader).catch((error) => {
      console.error('Erro ao Dashboard:', error);
      return null;
    })

  return (
    <div className='flex flex-col w-full max-w-6xl mx-auto mt-2 gap-2'>
      <NavBarAdmin/>
      <DashBoard data={data}/>
    </div>
  )
};