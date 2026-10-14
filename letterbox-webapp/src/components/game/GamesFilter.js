'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObterGenres, ObterTags, ObterDevs } from '@/services/api';

export default function GamesFilter() {
    const router = useRouter();

    const filtersList = [
        {'label':'Gêneros', 'slug':'genres'},
        {'label':'Tags', 'slug':'tags'},
        {'label':'Desenvolvedor', 'slug':'developers'}
    ]
    const [genres, setGenres] = useState([])
    const [tags, setTags] = useState([])
    const [devs, setDevs] = useState([])
    
    const [inputs, setInputs] = useState({
        'Gêneros': '',
        'Tags': '',
        'Desenvolvedor': ''
    })

    const buttonFilters = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (inputs['Gêneros']?.trim()) {
            params.append('genres', inputs['Gêneros'].trim());
        }
        if (inputs['Tags']?.trim()) {
            params.append('tags', inputs['Tags'].trim());
        }
        if (inputs['Desenvolvedor']?.trim()) {
            params.append('developer', inputs['Desenvolvedor'].trim());
        }
        
        const queryString = params.toString();
        const rota = queryString ? `/games?${queryString}` : '/games';

        router.replace(rota);
    };

    const filteredGenres = genres.filter(genre =>
        genre.toLowerCase().includes((inputs['Gêneros'] || '').toLowerCase())
    );

    const filteredTags = tags.filter(tag =>
        tag.toLowerCase().includes((inputs['Tags'] || '').toLowerCase())
    );

    const filteredDevs = devs.filter(dev =>
        dev.toLowerCase().includes((inputs['Desenvolvedor'] || '').toLowerCase())
    );

    const InputChange = (filter, value) => {
        setInputs(prev => ({ ...prev, [filter]: value }));
    };

    useEffect(() => {
        ObterGenres()
        .then((dados) => {setGenres(dados)})
        .catch((error) => console.error('Erro ao buscar gêneros:', error));

        ObterTags()
        .then((dados) => {setTags(dados)})
        .catch((error) => console.error('Erro ao buscar tags:', error));

        ObterDevs()
        .then((dados) => {setDevs(dados)})
        .catch((error) => console.error('Erro ao buscar tags:', error));
      }, []);

    return(
        <div className='flex flex-col gap-2'>
            {filtersList.map((filter) => (
                <div key={filter['label']}>
                    <label htmlFor={filter['label']}>{filter['label']}</label>
                    <div className="relative group flex bg-primary-700 h-10">
                        <input type="text" id={filter['label']} name={filter['slug']} value={inputs[filter['label']] || ''} onChange={(e) => {InputChange(filter['label'], e.target.value)}} className="w-full pl-2 text-sm focus:outline-none"/>
                        <ul className="hidden group-focus-within:block z-10 absolute left-0 top-10 h-fit max-h-40 bg-primary-400 w-full overflow-y-auto overflow-x-hidden scrollbar snap-y snap-mandatory">
                            {filter['label'] === filtersList[0]['label'] && (
                                <>
                                    {filteredGenres.length > 0 ? (
                                        filteredGenres.map((genre) => (
                                            <li key={genre} className="p-2 hover:bg-primary-500 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={(e) => InputChange(filter['label'], genre)}>{genre}</li>
                                        ))
                                    ) : (
                                        <li className="p-2 text-sm text-gray-300">Nenhum gênero encontrado</li>
                                    )}
                                </>
                            )}
                            {filter['label'] === filtersList[1]['label'] && (
                                <>
                                    {filteredTags.length > 0 ? (
                                        filteredTags.map((tag) => (
                                            <li key={tag} className="p-2 hover:bg-primary-500 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={(e) => InputChange(filter['label'], tag)}>{tag}</li>
                                        ))
                                    ) : (
                                        <li className="p-2 text-sm text-gray-300">Nenhuma Tag encontrada</li>
                                    )}
                                </>
                            )}
                            {filter['label'] === filtersList[2]['label'] && (
                                <>
                                    {filteredDevs.length > 0 ? (
                                        filteredDevs.map((dev) => (
                                            <li key={dev} className="p-2 hover:bg-primary-500 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={(e) => InputChange(filter['label'], dev)}>{dev}</li>
                                        ))
                                    ) : (
                                        <li className="p-2 text-sm text-gray-300">Nenhum dev encontrado</li>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            ))}
            <button
                className="flex w-full justify-center rounded-md bg-primary-300 px-3 py-1.5 text-sm/6 font-bold text-primary-800 hover:bg-primary-200 cursor-pointer"
                onClick={(e) => buttonFilters(e)}
              >
                Filtrar
            </button>
        </div>
    )
}