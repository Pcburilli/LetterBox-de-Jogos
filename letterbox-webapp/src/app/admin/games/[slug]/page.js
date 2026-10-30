
import { ObterJogo, ObterJogoInfo } from '@/services/api';
import NavBarAdmin from '@/components/admin/NavBarAdmin';
import GamePageAdmin from '@/components/admin/GamePageAdmin';

export default async function Page({ params }) {
  const { slug } = await params
  const slugDecodificado = decodeURIComponent(slug);

  const [dadosGeraisJogo, dadosInfoGame] = await Promise.all([
    ObterJogo(slug).catch((error) => {
      console.error('Erro ao buscar jogo:', error);
      return null;
    }),
    ObterJogoInfo(slug).catch((error) => {
      console.error('Erro ao buscar info do jogo:', error);
      return null;
    }),
  ]);
  const dadosJogo = dadosGeraisJogo?.game

  return (
    <div className='mt-2'>
      <NavBarAdmin />
      <GamePageAdmin jogo={dadosJogo || null} infoGame={dadosInfoGame || null} pathname={slugDecodificado}/>
    </div>
  );
};