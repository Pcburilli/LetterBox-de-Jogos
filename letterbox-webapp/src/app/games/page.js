
import GamesFilter from '@/components/games/GamesFilter';
import TableGames from '@/components/games/TableGames';

import { cookies } from 'next/headers';
import { FiltersGames, ObterGenres, ObterTags, ObterDevs } from '@/services/api';

export default async function GamesPage({ searchParams }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('session');

  const query = await searchParams;
  const genres = query.genres || '';
  const tags = query.tags || '';
  const developer = query.developer || '';
  const page = query.page || '1';

  const filters = `genres=${genres}&tags=${tags}&developer=${developer}`

  const gamesData = await FiltersGames(filters, page).catch((error) => {
    console.error('Erro ao buscar jogos:', error);
    return null;
  })

  const [genresData, tagsData, devsData] = await Promise.all([
    ObterGenres().catch((error) => {
      console.error('Erro ao buscar genres:', error);
      return null;
    }),
    ObterTags().catch((error) => {
      console.error('Erro ao buscar tags:', error);
      return null;
    }),
    ObterDevs().catch((error) => {
      console.error('Erro ao buscar devs:', error);
      return null;
    }),
  ]);

  return (
    <div id="div_principal" className="flex flex-col md:flex-row w-full max-w-6xl mx-auto mt-2 md:mt-8 gap-2">
      <GamesFilter genres={genresData} tags={tagsData} devs={devsData}/>

      <TableGames gamesData={gamesData}/>
    </div>
  );
};