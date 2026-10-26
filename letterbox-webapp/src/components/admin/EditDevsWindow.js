'use state'

import { useState, useEffect } from 'react';
import { ObterDevs } from '@/services/api';

export default function EditDevsWindow({ setEditDevsWindow, devs, setDevs }) {
    
    const [devsExist, setDevsExist] = useState([])
    const [devSelect, setDevSelect] = useState('')

    const filteredDevs = devsExist.filter(dev =>
        dev.toLowerCase().includes(devSelect.toLowerCase())
    );

    const AddDev = (dev) => {
        if (devs.find((g) => g === dev)) {
            alert('dev já existente')
            return
        }
        setDevs([...devs, dev])
    }

    const RemoveDev = (devToRemove) => {
        setDevs(prevDevs => prevDevs.filter(dev => dev !== devToRemove));
    }

    useEffect(() => {
        ObterDevs()
        .then((dados) => {setDevsExist(dados)})
        .catch((error) => console.error('Erro ao buscar devs:', error));
    }, []);

    return (
        <div className='relative flex flex-col w-full p-3 gap-3 h-fit rounded-2xl bg-primary-700 sm:w-150 sm:border-6 sm:border-primary-800'>
            <button className='z-1 absolute text-3xl right-0 top-0 mr-3 mt-1 text-primary-800 hover:text-primary-300 cursor-pointer' onClick={() => setEditDevsWindow(false)}>×</button>

            <div className='t-2 flex flex-col gap-2'>
                <label htmlFor="dev" className="text-xs font-semibold text-primary-200 tracking-wide uppercase">
                    Adicionar Devs
                </label>

                <input placeholder='Procure o dev (clique para adicionar)...' type="text" id='dev' name='dev' className="w-full bg-primary-800 text-white placeholder-primary-400 px-3.5 py-2.5 text-sm rounded-lg border border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" onChange={(e) => setDevSelect(e.target.value)}/>

                <ul className="group-focus-within:block max-h-36 w-full overflow-y-auto overflow-x-hidden rounded-lg bg-primary-800 border border-primary-600 shadow-lg divide-y divide-primary-700">
                    {filteredDevs.map((dev) => (
                        <li key={dev} className="px-3.5 py-2 text-sm text-primary-100 bg-primary-800 hover:bg-primary-600 hover:text-white cursor-pointer transition-colors" onMouseDown={(e) => e.preventDefault()} onClick={() => AddDev(dev)}>{dev}</li>
                    ))}

                    {filteredDevs.length === 0 && (
                        <>
                            <li className="px-3.5 py-2 text-xs text-primary-400">
                                Nenhum dev encontrado
                            </li>
                            <button className="w-full py-2 text-xs text-primary-100 font-bold hover:bg-primary-600 cursor-pointer" onClick={() => AddDev(devSelect)}>
                                <p>Adicionar novo Desenvolvedor</p>
                            </button>
                        </>
                    )}
                </ul>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <div className='relative flex'>
                    <p className="text-xs font-semibold text-primary-200 tracking-wide uppercase">Devs Selecionados ({devs.length})</p>
                    {devs.length > 1 && (
                        <button className='absolute right-0 -top-1 text-xs font-semibold text-primary-200 bg-primary-800 hover:bg-primary-500 rounded-xl p-1 pr-2 pl-2 cursor-pointer' onClick={() => setDevs([])}>
                            Excluir Devs
                        </button>
                    )}
                </div>

                <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full'>
                    {devs.map((dev) => (
                        <li key={dev} className='relative flex items-center justify-between px-3 py-1.5 bg-primary-800 border border-primary-600 rounded-md text-xs text-primary-100 shadow-sm'>
                            <span className="truncate">{dev}</span>
                            <button className='absolute right-2 font-bold cursor-pointer hover:text-red-500' onClick={() => RemoveDev(dev)}>x</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}