'use state'

import { useState, useEffect } from 'react';
import { ObterGenres, ObterTags } from '@/services/api';

export default function EditGenresWindow({ setEditGenresWindow, genres, setGenres }) {
    
    const [genresExist, setGenresExist] = useState([])
    const [genreSelect, setGenreSelect] = useState('')

    const filteredGenres = genresExist.filter(genre =>
        genre.toLowerCase().includes(genreSelect.toLowerCase())
    );

    const AddGenre = (genre) => {
        if (genres.find((g) => g === genre)) {
            alert('genre já existente')
            return
        }
        setGenres([...genres, genre])
    }

    const RemoveGenre = (genreToRemove) => {
        setGenres(prevGenres => prevGenres.filter(genre => genre !== genreToRemove));
    }

    useEffect(() => {
        ObterGenres()
        .then((dados) => {setGenresExist(dados)})
        .catch((error) => console.error('Erro ao buscar genres:', error));
    }, []);

    return (
        <div className='relative flex flex-col w-full p-3 gap-3 h-fit rounded-2xl bg-primary-700 sm:w-150 sm:border-6 sm:border-primary-800'>
            <button className='z-1 absolute text-3xl right-0 top-0 mr-3 mt-1 text-primary-800 hover:text-primary-300 cursor-pointer' onClick={() => setEditGenresWindow(false)}>×</button>

            <div className='t-2 flex flex-col gap-2'>
                <label htmlFor="tag" className="text-xs font-semibold text-primary-200 tracking-wide uppercase">
                    Adicionar Gêneros
                </label>

                <input placeholder='Procure a tag (clique para adicionar)...' type="text" id='tag' name='tag' className="w-full bg-primary-800 text-white placeholder-primary-400 px-3.5 py-2.5 text-sm rounded-lg border border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" onChange={(e) => setGenreSelect(e.target.value)}/>

                <ul className="group-focus-within:block max-h-36 w-full overflow-y-auto overflow-x-hidden rounded-lg bg-primary-800 border border-primary-600 shadow-lg divide-y divide-primary-700">
                    {filteredGenres.map((genre) => (
                        <li key={genre} className="px-3.5 py-2 text-sm text-primary-100 bg-primary-800 hover:bg-primary-600 hover:text-white cursor-pointer transition-colors" onMouseDown={(e) => e.preventDefault()} onClick={() => AddGenre(genre)}>{genre}</li>
                    ))}

                    {filteredGenres.length === 0 && (
                        <li className="px-3.5 py-2 text-xs text-primary-400">
                            Nenhum gênero encontrado
                        </li>
                    )}
                </ul>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <div className='relative flex'>
                    <p className="text-xs font-semibold text-primary-200 tracking-wide uppercase">Gêneros Selecionados ({genres.length})</p>
                    {genres.length > 1 && (
                        <button className='absolute right-0 -top-1 text-xs font-semibold text-primary-200 bg-primary-800 hover:bg-primary-500 rounded-xl p-1 pr-2 pl-2 cursor-pointer' onClick={() => setGenres([])}>
                            Excluir Gêneros
                        </button>
                    )}
                </div>

                <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full'>
                    {genres.map((genre) => (
                        <li key={genre} className='relative flex items-center justify-between px-3 py-1.5 bg-primary-800 border border-primary-600 rounded-md text-xs text-primary-100 shadow-sm'>
                            <span className="truncate">{genre}</span>
                            <button className='absolute right-2 font-bold cursor-pointer hover:text-red-500' onClick={() => RemoveGenre(genre)}>x</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}