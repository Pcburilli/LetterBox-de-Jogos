'use state'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NavBarAdmin() {

    return (
        <div className='flex justify-between w-full bg-primary-700 rounded-2xl gap-8 p-2 pl-5 pr-5'>
            <h1 className='text-sm flex gap-1'>NAVEGAÇÃO <p className='text-yellow-300 font-bold'>ADMIN</p></h1>
            <nav className='flex bg-primary-700 rounded-2xl gap-8'>
            <Link href="/admin" className="text-sm font-medium text-slate-300 hover:text-primary-100 transition-colors">
                INÍCIO
            </Link>
            <Link href="/admin/games" className="text-sm font-medium text-slate-300 hover:text-primary-100 transition-colors">
                GAMES
            </Link>
            <Link href="/admin/games/add" className="text-sm font-medium text-slate-300 hover:text-primary-100 transition-colors">
                ADICIONAR GAME
            </Link>
            </nav>
        </div>
    )
}