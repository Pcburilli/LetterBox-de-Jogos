'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
 
  return (
    <div className='flex flex-col mt-8 mb-8 gap-8 md:flex-row'>
      <div id='lateral' className='bg-amber-600 size-auto grow-2 min-w-60 flex flex-col items-center'>
        <img className='bg-amber-950 h-130 w-110 center md:w-full'></img>
        <div>
          <p>tags</p>
        </div>
      </div>
      <div id='principal' className='bg-amber-200 size-auto grow-4'>
        <h1 className='text-4xl'>Nome Jogo</h1>
        <p className='text-2xl'>Ano do jogo</p>
        <button className='bg-green-800 p-2 rounded-4xl'>botão adicionar</button>
        <div className='bg-red-600 rounded-2xl h-25'>
          <p>desenvolvedores</p>
        </div>
        <div className='bg-purple-400 h-70'>
          <p>descrição</p>
        </div>
      </div>
    </div>
  );
};