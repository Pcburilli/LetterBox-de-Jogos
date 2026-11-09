'use client'

import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteReviewAction } from "@/actions/user";

export default function TableReviews({ reviews, totalPage, PageAtual }) {

  const searchParams = useSearchParams();
  const router = useRouter();

  const PagList = (totalStr, vizinhos = 1) => {
    const total = Number(totalStr);
    const pageAtual = Number(PageAtual);

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let inicio = Math.max(1, pageAtual - vizinhos);
    let fim = Math.min(total, pageAtual + vizinhos);

    if (pageAtual <= 3) {
      inicio = 1;
      fim = 5;
    } else if (pageAtual >= total - 2) {
      inicio = total - 4;
      fim = total;
    }

    const paginas = [];

    if (inicio > 1) {
      paginas.push(1);
      if (inicio > 2);
    }

    for (let p = inicio; p <= fim; p++) {
      paginas.push(p);
    }

    if (fim < total) {
      if (fim < total - 1);
      paginas.push(total);
    }

    return paginas;
  };
    
  const TrocarPage = (NewPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page_reviews', NewPage.toString());

    router.replace(`/admin/users?${params.toString()}`);
  }

  const DeletarReview = async (e, id) => {
    e.preventDefault();

    const confirmar = window.confirm("Prosseguir com a EXCLUSÃO da review?");

    if (confirmar) {
        const result = await deleteReviewAction(id)
        if (result.success) {
            alert('Review deletada com sucesso.')
        } else {
            alert(result.error || 'Erro ao excluir review.')
        }
    } else {
        console.log('Ação cancelada.')
        return
    }
  }

  if (!reviews) {
    return ''
  }

  return (
  <div className='flex flex-col'>
    <div className='w-full flex flex-wrap justify-center gap-2'>
      {reviews?.map((review) => (
        <div key={review?.id} className='relative shrink-0 focus:outline-none flex flex-col justify-between gap-3 p-2 h-40 w-55 md:w-60 rounded-xl bg-primary-800/70'>
          <button className='absolute z-1 right-2 top-2 bg-red-700 rounded-2xl border-2 border-primary-900 pr-2 pl-2 font-bold hover:bg-red-800 cursor-pointer' onClick={(e) => DeletarReview(e, review.id)}>x</button>
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

      <div className='flex justify-center gap-3'>
      {PagList(totalPage)?.map((pag) => (
          <button key={pag} onClick={() => TrocarPage(pag)} className='cursor-pointer text-primary-300 hover:text-primary-200'>{pag}</button>
      ))}
      </div>
  </div>
  )
}