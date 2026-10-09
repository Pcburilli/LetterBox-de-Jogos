'use client';

import PerfilCard from '@/components/perfil/PerfilCard';
import PerfilCatalog from '@/components/perfil/PerfilCatalog';
import Statistics from '@/components/perfil/Statistics';
import { useState, useEffect } from 'react';

export default function PerfilPage() {
  
  return (
    <div className='w-full mt-8 gap-2'>
      <div className='w-full'>
        <PerfilCard />
      </div>

      <div className='flex mb-2'>
        <div className='w-full md:w-9/12'>
          <PerfilCatalog />
        </div>
        <div>
          <Statistics />
        </div>
      </div>
    </div>
  )
};