
import { cookies } from 'next/headers';

import PerfilCard from '@/components/perfil/PerfilCard';
import PerfilCatalog from '@/components/perfil/PerfilCatalog';
import Statistics from '@/components/perfil/Statistics';

import { ObterPerfil, ObterCatalogo  } from '@/services/api';

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [dadosPerfil, dadosCatalogo] = await Promise.all([
    ObterPerfil(cookieHeader).catch((error) => {
      console.error('Erro ao buscar jogo:', error);
      return null;
    }),
    ObterCatalogo(cookieHeader).catch((error) => {
      console.error('Erro ao buscar info do jogo:', error);
      return null;
    }),
  ]);

  const lengthCatalog = dadosCatalogo?.length ?? 0;

  return (
    <div className='w-full mt-2 md:mt-8 gap-2'>
      <div className='w-full'>
        <PerfilCard dadosUsuario={dadosPerfil} lengthCatalog={lengthCatalog}/>
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