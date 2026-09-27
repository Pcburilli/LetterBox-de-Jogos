import GamePage from '@/components/game/GamePage';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session');

  return <GamePage isLoggedIn={isLoggedIn} />;
}