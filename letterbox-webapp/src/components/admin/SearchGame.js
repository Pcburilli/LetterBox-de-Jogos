'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchGame() {
    const router = useRouter()
    const [search, setSearch] = useState('')

    const SearchGame = (e) => {
        e.preventDefault();
        
        router.replace(`/admin/games?q=${encodeURIComponent(search.trim())}&page=1`);
    }

    return (
        <div className='w-full h-fit bg-primary-800 rounded-2xl p-3'>
            <div className=''>
                <form id='search' onSubmit={SearchGame} className='flex mr-4 md:mr-0 ml-auto md:ml-0 items-center w-full h-8 bg-primary-700 rounded-2xl focus-within:ring-2 focus-within:ring-primary-500 transition-all'>
                    <input 
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Procure o jogo desejado...'
                    className='w-full pl-3 pr-1 text-xs text-primary-100 placeholder:text-primary-300 bg-transparent focus:outline-none'
                    />
                    <button 
                    type="submit" 
                    className='flex items-center justify-center w-8 h-full text-primary-300 hover:text-white rounded-r-2xl cursor-pointer transition-colors shrink-0'
                    >
                    🔍︎
                    </button>
                </form>
            </div>
        </div>
    )
}