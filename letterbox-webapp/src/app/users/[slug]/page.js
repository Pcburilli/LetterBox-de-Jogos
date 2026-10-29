
import PerfilCard from '@/components/user/PerfilCard';
import PerfilCatalog from '@/components/user/PerfilCatalog';
import Statistics from '@/components/user/Statistics';

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { ObterInfoUser, AuthPerfil } from '@/services/api';

export default async function PerfilPage({ params }) {
  const { slug } = await params

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const cookieHeader = cookieStore.toString();

  let isUser = false;

  if (sessionToken) {
    const verificarUser = await AuthPerfil(cookieHeader).catch((error) => {
      console.error('Erro ao verificar perfil autenticado:', error);
      return null;
    });

    isUser = verificarUser?.username === slug;
  }

  let dadosUser = await ObterInfoUser(slug).catch((error) => {
      console.error('Erro ao buscar catalogo:', error);
      return null;
    })

  if (!dadosUser || dadosUser.status !== 200) {
    notFound();
  }

  dadosUser = await dadosUser.json();
  
  const dadosCatalogo = dadosUser.catalog
  const dadosPerfil = dadosUser.user

  const lengthCatalog = dadosCatalogo?.length ?? 0;

  return (
    <div className='w-full mt-2 md:mt-8 gap-2'>
      <div className='w-full'>
        <PerfilCard dadosUsuario={dadosPerfil} lengthCatalog={lengthCatalog} isUser={isUser}/>
      </div>

      <div className='flex mb-2'>
        <div className='w-full md:w-9/12'>
          <PerfilCatalog catalogo={dadosCatalogo}/>
        </div>
        <div>
          <Statistics />
        </div>
      </div>
    </div>
  )
};