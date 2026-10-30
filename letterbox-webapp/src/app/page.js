
import { ObterInfoIndex } from '@/services/api';
import Link from 'next/link';

export default async function Home() {
  const dadosIndex = await ObterInfoIndex().catch((error) => {
    console.error('Erro ao buscar jogos:', error);
    return null;
  })
  
  const jogos = dadosIndex?.games || []
  const reviews = dadosIndex?.reviews || []
  const game_random = dadosIndex?.game_random || null

  return (
    <main className="home-page">
      <div className="flex flex-col items-center">
        <div className="w-full h-80 md:h-128 bg-cover bg-center bg-no-repeat rounded-4xl flex flex-col justify-end pb-8 relative" style={{backgroundImage: game_random?.cover_url ? `url(${game_random.cover_url})` : undefined}}>
          <div className="absolute inset-0 bg-linear-to-t from-primary-900 via-slate-950/1 justify-end pb-8 px-4"></div>
          <div className="absolute inset-0 bg-linear-to-r from-primary-900 via-slate-950/1 justify-end pb-8 px-4"></div>
          <div className="absolute inset-0 bg-linear-to-l from-primary-900 via-slate-950/1 justify-end pb-8 px-4"></div>
          <h1 className="relative z-10 text-2xl md:text-3xl font-bold text-center text-white drop-shadow-lg px-4">
            Avalie seus jogos preferidos.<br/>Salve aqueles que deseja jogar.<br/>Se divirta!
          </h1>
        </div>

        <div id='jogos' className='w-full'>
          <h1 className='font-bold text-xl ml-4'>Jogos recentes cadastrados</h1>
          <div className='flex items-center gap-2 p-2 pb-1 mb-2 w-full overflow-x-auto scrollbar-none sm:scrollbar-thin scrollbar-gutter-auto snap-x snap-mandatory scrollbar-thumb-primary-400'>
            {jogos?.map((jogo) => (
              <div key={jogo.name_slug} className='relative group overflow-hidden rounded-3xl min-w-30 md:min-w-35'>
                <Link href={`/games/${jogo?.name_slug}`}>
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end justify-center align-middle bg-primary-900/50 border-2 border-primary-300 rounded-3xl text-center transition-opacity duration-300 z-10'>
                    <div className='pb-2 w-full'>
                      <p className='font-semibold text-xl text-white'>{jogo?.name}</p>
                    </div>
                  </div>

                  <img
                    src={jogo?.cover_url} 
                    alt={jogo?.name} 
                    className="w-full h-48 sm:h-56 object-cover rounded-3xl"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div id='jogos' className='w-full'>
          <h1 className='font-bold text-xl ml-4'>Reviews recentes</h1>
          <div className='flex items-center gap-2 p-2 pb-1 mb-2 w-full overflow-x-auto scrollbar-none sm:scrollbar-thin scrollbar-gutter-auto snap-x snap-mandatory scrollbar-thumb-primary-400'>
            {reviews?.map((review) => (
              <div key={review?.id} className='shrink-0 focus:outline-none flex flex-col justify-between gap-3 p-2 h-40 w-55 md:w-60 rounded-xl bg-primary-800/70'>
                <div id='superior' className='flex gap-2 max-h-full overflow-hidden'>
                  <div className='flex flex-col gap-1 items-center shrink-0'>
                    <Link href={`/games/${review?.name_slug}`} className='relative w-15 h-25 block'>
                      <img src={review?.cover_url} alt={review?.name} className='w-full h-full object-cover rounded-xl' />
                      <div className='absolute top-0 left-0 rounded-xl h-full w-full opacity-0 hover:opacity-100 bg-primary-900/50 border-2 border-primary-300 transition-opacity duration-300'></div>
                    </Link>
                  </div>

                  <div className='flex flex-col flex-1 wrap-anywhere overflow-hidden'>
                    {review?.rate ? (
                      <div className='flex w-fit font-bold justify-center items-center'>
                        ☆ {review.rate}
                      </div>
                    ) : <p className='flex w-fit font-bold justify-center items-center'>☆ Sem nota</p>}
                    <p className="text-sm line-clamp-4 text-ellipsis">
                      {review?.review}
                    </p>
                  </div>
                </div>

                <div id='inferior' className='flex gap-2 items-center shrink-0'>
                  <Link href={`/users/${review?.username}`} prefetch={false}>
                    <img src={review?.icon_url} alt={review?.username} className='w-8 h-8 object-cover rounded-full hover:bg-primary-700' />
                  </Link>
                  <h1 className='text-lx font-medium truncate capitalize'>{review?.username}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};