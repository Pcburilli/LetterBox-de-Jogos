import GamePage from '@/components/game/GamePage';
import { ObterJogo, ObterJogoInfo } from '@/services/api';
import { cookies } from 'next/headers';

export default async function Page({ params }) {
  const { slug } = await params
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session');

  const [dadosJogo, dadosInfoGame] = await Promise.all([
    ObterJogo(slug),
    ObterJogoInfo(slug),
  ]);

  return (
    <GamePage
      jogo={dadosJogo} 
      infoGame={dadosInfoGame} 
      isLoggedIn={isLoggedIn}
      slug={slug}
    />
  );
}