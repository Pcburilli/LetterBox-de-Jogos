import NavBarAdmin from '@/components/admin/NavBarAdmin';
import SearchGame from '@/components/admin/SearchGame';
import TableGames from '@/components/admin/TableGames';

import { ObterJogosSearch } from '@/services/api';

export default async function GamesPage({ searchParams }) {
  const query = await searchParams;
  const name = query.q || '';
  const page = query.page || '';

  const dados_jogos = await ObterJogosSearch(name, page)

  const listaJogos = dados_jogos?.games || [];
  const totalPaginas = dados_jogos?.total_page || 1;

  return (
    <div id="div_principal" className="flex flex-col w-full max-w-6xl mx-auto mt-2 gap-2">
      <NavBarAdmin />

      <SearchGame />

      <TableGames jogos={listaJogos} totalPage={totalPaginas}/>

    </div>
  );
};