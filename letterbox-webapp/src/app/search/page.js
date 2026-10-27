
import { ObterJogosSearch } from '@/services/api';
import TableGames from '@/components/search/TableGames';

export default async function SearchGame({ searchParams }) {
  const query = await searchParams;
  const search = query.q || '';
  const page = query.page || '1';

  const gamesData = await ObterJogosSearch(search, page).catch((error) => {
    console.error('Erro ao buscar jogos:', error);
    return null;
  })

  return (
    <div id="div_principal" className="w-full max-w-6xl mx-auto mt-8">
      <TableGames gamesData={gamesData} search={search}/>
    </div>
  );
}