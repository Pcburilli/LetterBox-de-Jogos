import GamePage from '@/components/game/GamePage';
import { ObterJogo, ObterJogoInfo } from '@/services/api';
import { cookies } from 'next/headers';

export default async function Page({ params }) {
  const { slug } = await params

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session');

  const [dadosJogo, dadosInfoGame] = await Promise.all([
    ObterJogo(slug).catch((error) => {
      console.error('Erro ao buscar jogo:', error);
      return null;
    }),
    ObterJogoInfo(slug).catch((error) => {
      console.error('Erro ao buscar info do jogo:', error);
      return null;
    }),
  ]);

  return (
    <GamePage
      jogo={dadosJogo || null} 
      infoGame={dadosInfoGame || null} 
      isLoggedIn={isLoggedIn}
      slug={slug}
    />
  );
}