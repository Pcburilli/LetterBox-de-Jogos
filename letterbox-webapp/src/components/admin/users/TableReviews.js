'use client'

import Link from "next/link"

export default function TableReviews({ reviews }) {
    console.log(reviews)

    return (
        <div className='w-full flex flex-wrap justify-center gap-2'>
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
    )
}