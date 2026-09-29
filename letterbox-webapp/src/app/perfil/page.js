'use client';

import PerfilCard from '@/components/perfil/PerfilCard';
import PerfilCatalog from '@/components/perfil/PerfilCatalog';
import { useState, useEffect } from 'react';

export default function PerfilPage() {
  
  return (
    <div className='flex md:flex-nowrap flex-wrap w-full mt-2'>
      <div className='grow md:mr-2'>
        <PerfilCard />
      </div>
      <div id='conteudo' className='grow-100'>
        <h1 className='text-3xl md:text-4xl font-bold mb-6 text-center'>Seu catálogo</h1>
        <PerfilCatalog/>
      </div>
    </div>
  )
};