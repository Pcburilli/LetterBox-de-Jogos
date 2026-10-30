'use client';

import Link from 'next/link';

export default function GameReviews({ reviews }) {
    if (!reviews || reviews?.length === 0) { 
        return (
        <>
            <h1 className='font-bold text-2xl'>Reviews</h1>
            <div className='w-full mb-2'>Sem reviews disponíveis.</div>
        </>
        )
    }
    
    return (
        <>
            <h1 className='font-bold text-2xl'>Reviews</h1>
            <div className='flex max-h-42 items-stretch gap-2 p-2 pb-1 mb-2 w-full overflow-x-auto scrollbar-none sm:scrollbar-thin scrollbar-gutter-auto snap-x snap-mandatory scrollbar-thumb-primary-400'>
                {reviews?.map((review) => (
                <div key={review?.id} className='shrink-0 focus:outline-none flex flex-col gap-1 p-2 h-auto w-55 md:w-60 rounded-xl bg-primary-800/70'>
                    <div id='superior' className='flex gap-2 items-center shrink-0'>
                    <Link href={`/users/${review?.username}`} prefetch={false}>
                        <img src={review?.icon_url} alt={review?.username} className='w-8 h-8 object-cover rounded-full hover:bg-primary-700' />
                    </Link>
                    <h1 className='text-lx font-medium truncate capitalize'>{review?.username}</h1>
                    </div>

                    <div id='inferior' className='flex gap-2 max-h-full overflow-hidden'>
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
                </div>
                ))}
        </div>
      </>
    )
}