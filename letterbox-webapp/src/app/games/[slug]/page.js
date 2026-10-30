import GamePage from '@/components/game/GamePage';
import GameReviews from '@/components/game/GameReviews';

import { ObterJogo, ObterJogoInfo } from '@/services/api';
import { cookies } from 'next/headers';

export default async function Page({ params }) {
  const { slug } = await params

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session');

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
  const reviews = dadosGeraisJogo?.reviews || null

  return (
    <div className='w-full mt-2 md:mt-8 gap-2'>
      <GamePage
        jogo={dadosJogo || null} 
        infoGame={dadosInfoGame || null} 
        isLoggedIn={isLoggedIn}
        slug={slug}
      />
      <GameReviews reviews={reviews}/>
    </div>
  );
}