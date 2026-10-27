'use client'

import { useState, useEffect } from 'react';
import { ObterTags } from '@/services/api';

export default function EditTagsWindow({ setEditTagsWindow, tags, setTags }) {
    
    const [tagsExist, setTagsExist] = useState([])
    const [tagSelect, setTagSelect] = useState('')

    const filteredTags = tagsExist.filter(tag =>
        tag.toLowerCase().includes(tagSelect.toLowerCase())
    );

    const AddTag = (tag) => {
        if (tags.find((f) => f === tag)) {
            alert('tag já existente')
            return
        }
        setTags([...tags, tag])
    }

    const RemoveTag = (tagToRemove) => {
        setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    }

    useEffect(() => {
        ObterTags()
        .then((dados) => {setTagsExist(dados)})
        .catch((error) => console.error('Erro ao buscar tags:', error));
    }, []);

    return (
        <div className='relative flex flex-col w-full p-3 gap-3 h-fit rounded-t-2xl bg-primary-700 sm:w-150 sm:rounded-2xl sm:border-6 sm:border-primary-800'>
            <button className='z-1 absolute text-3xl right-0 top-0 mr-3 mt-1 text-primary-800 hover:text-primary-300 cursor-pointer' onClick={() => setEditTagsWindow(false)}>×</button>

            <div className='t-2 flex flex-col gap-2'>
                <label htmlFor="tag" className="text-xs font-semibold text-primary-200 tracking-wide uppercase">
                    Adicionar Tags
                </label>

                <input placeholder='Procure a tag (clique para adicionar)...' type="text" id='tag' name='tag' className="w-full bg-primary-800 text-white placeholder-primary-400 px-3.5 py-2.5 text-sm rounded-lg border border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" onChange={(e) => setTagSelect(e.target.value)}/>

                <ul className="group-focus-within:block max-h-36 w-full overflow-y-auto overflow-x-hidden rounded-lg bg-primary-800 border border-primary-600 shadow-lg divide-y divide-primary-700">
                    {filteredTags.map((tag) => (
                        <li key={tag} className="px-3.5 py-2 text-sm text-primary-100 bg-primary-800 hover:bg-primary-600 hover:text-white cursor-pointer transition-colors" onMouseDown={(e) => e.preventDefault()} onClick={() => AddTag(tag)}>{tag}</li>
                    ))}

                    {filteredTags.length === 0 && (
                        <>
                            <li className="px-3.5 py-2 text-xs text-primary-400">
                                Nenhuma tag encontrada
                            </li>
                            <button className="w-full py-2 text-xs text-primary-100 font-bold hover:bg-primary-600 cursor-pointer" onClick={() => AddTag(tagSelect)}>
                                <p>Adicionar nova Tag</p>
                            </button>
                        </>
                    )}
                </ul>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <div className='relative flex'>
                    <p className="text-xs font-semibold text-primary-200 tracking-wide uppercase">Tags Selecionadas ({tags.length})</p>
                    {tags.length > 1 && (
                        <button className='absolute right-0 -top-1 text-xs font-semibold text-primary-200 bg-primary-800 hover:bg-primary-500 rounded-xl p-1 pr-2 pl-2 cursor-pointer' onClick={() => setTags([])}>
                            Excluir tags
                        </button>
                    )}
                </div>

                <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full'>
                    {tags.map((tag) => (
                        <li key={tag} className='relative flex items-center justify-between px-3 py-1.5 bg-primary-800 border border-primary-600 rounded-md text-xs text-primary-100 shadow-sm'>
                            <span className="truncate">{tag}</span>
                            <button className='absolute right-2 font-bold cursor-pointer hover:text-red-500' onClick={() => RemoveTag(tag)}>x</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}