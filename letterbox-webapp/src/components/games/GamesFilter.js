'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GamesFilter({genres, tags, devs}) {
    const router = useRouter();
    const [filterVisibility, setFilterVisibility] = useState(false)

    const filtersList = [
        {'label':'Gêneros', 'slug':'genres'},
        {'label':'Tags', 'slug':'tags'},
        {'label':'Desenvolvedor', 'slug':'developers'}
    ];
    
    const [inputs, setInputs] = useState({
        'Gêneros': '',
        'Tags': '',
        'Desenvolvedor': ''
    });

    const buttonFilters = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if ((inputs['Gêneros']?.trim() + inputs['Tags'].trim() + inputs['Desenvolvedor'].trim()) === '') {
            return;
        };
        
        const genre_find = genres?.find((g) => g === inputs['Gêneros']?.trim())
        const tag_find = tags?.find((t) => t === inputs['Tags'].trim())
        const dev_find = devs?.find((d) => d === inputs['Desenvolvedor'].trim())
        
        const isGenreInvalid = inputs['Gêneros']?.trim() !== '' && !genre_find;
        const isTagInvalid = inputs['Tags']?.trim() !== '' && !tag_find;
        const isDevInvalid = inputs['Desenvolvedor']?.trim() !== '' && !dev_find;

        if (isGenreInvalid || isTagInvalid || isDevInvalid) {
            alert('Escolha opções válidas.');
            return;
        }

        params.append('genres', inputs['Gêneros']?.trim());
        params.append('tags', inputs['Tags']?.trim());
        params.append('developer', inputs['Desenvolvedor']?.trim());
        
        const queryString = params.toString();
        const rota = queryString ? `/games?${queryString}` : '/games';

        router.replace(rota);
    };

    const filteredGenres = genres?.filter(genre =>
        genre.toLowerCase().includes((inputs['Gêneros'] || '').toLowerCase())
    );

    const filteredTags = tags?.filter(tag =>
        tag.toLowerCase().includes((inputs['Tags'] || '').toLowerCase())
    );

    const filteredDevs = devs?.filter(dev =>
        dev.toLowerCase().includes((inputs['Desenvolvedor'] || '').toLowerCase())
    );

    const InputChange = (filter, value) => {
        setInputs(prev => ({ ...prev, [filter]: value }));
    };

    return(
        <div id='filter' className='w-full h-fit md:max-w-60 bg-primary-800 rounded-2xl p-3'>
            <button className='w-full h-8 bg-primary-700 hover:bg-primary-500 rounded-2xl md:hidden cursor-pointer' onClick={() => setFilterVisibility(prev => !prev)}>Filtros</button>
            <div className={`${filterVisibility ? 'block' : 'hidden'} md:grid`}>
                <div className='flex flex-col gap-2'>
                    {filtersList?.map((filter) => (
                        <div key={filter['label']}>
                            <label htmlFor={filter['label']}>{filter['label']}</label>
                            <div className="relative group flex bg-primary-700 h-10">
                                <input type="text" id={filter['label']} name={filter['slug']} value={inputs[filter['label']] || ''} onChange={(e) => {InputChange(filter['label'], e.target.value)}} className="w-full pl-2 text-sm focus:outline-none"/>
                                <ul className="hidden group-focus-within:block z-10 absolute left-0 top-10 h-fit max-h-40 bg-primary-400 w-full overflow-y-auto overflow-x-hidden scrollbar snap-y snap-mandatory">
                                    {filter['label'] === filtersList[0]['label'] && (
                                        <>
                                            {filteredGenres?.length > 0 ? (
                                                filteredGenres?.map((genre) => (
                                                    <li key={genre} className="p-2 hover:bg-primary-500 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={(e) => InputChange(filter['label'], genre)}>{genre}</li>
                                                ))
                                            ) : (
                                                <li className="p-2 text-sm text-gray-300">Nenhum gênero encontrado</li>
                                            )}
                                        </>
                                    )}
                                    {filter['label'] === filtersList[1]['label'] && (
                                        <>
                                            {filteredTags?.length > 0 ? (
                                                filteredTags?.map((tag) => (
                                                    <li key={tag} className="p-2 hover:bg-primary-500 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={(e) => InputChange(filter['label'], tag)}>{tag}</li>
                                                ))
                                            ) : (
                                                <li className="p-2 text-sm text-gray-300">Nenhuma Tag encontrada</li>
                                            )}
                                        </>
                                    )}
                                    {filter['label'] === filtersList[2]['label'] && (
                                        <>
                                            {filteredDevs?.length > 0 ? (
                                                filteredDevs?.map((dev) => (
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
            </div>
        </div>
    )
}