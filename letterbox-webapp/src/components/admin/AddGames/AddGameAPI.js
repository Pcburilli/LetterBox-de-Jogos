'use client'

import { useState } from 'react';
import { addGameAction } from '@/actions/gameAdmin';

import EditTagsWindow from '@/components/admin/EditWindows/EditTagsWindow';
import EditGenresWindow from '@/components/admin/EditWindows/EditGenresWindow';
import EditDevsWindow from '@/components/admin/EditWindows/EditDevsWindow';

export default function AddGameAPI() {

    // Adicionar Manualmente
    const [name, setName] = useState(null)
    const [url, setUrl] = useState(null)
    const [year, setYear] = useState(null)
    const [description, setDescription] = useState(null)
    const [genres, setGenres] = useState([])
    const [tags, setTags] = useState([])
    const [devs, setDevs] = useState([])

    // Janelas EditGenres e EditTags
    const [editGenresWindow, setEditGenresWindow] = useState(false)
    const [editTagsWindow, setEditTagsWindow] = useState(false)
    const [editDevsWindow, setEditDevsWindow] = useState(false)

    const AdicionarJogo = async (e) => {
        e.preventDefault()
        const dados_jogo = AddBody();

        try {
            const result = await addGameAction(dados_jogo)

            if (result.success) {
                alert('Registro realizado.')
                console.log('Registro realizado:', result);
            }
            else if (result.status === 409) {
                alert('Jogo já cadastrado.')
                console.warn('Erro:', result);
            }
        } catch (error) {
        console.error('Falha na conexão:', error);
        }
    }

    const AddBody = () => {
        const body = {}
        body.name = name
        body.released = year
        body.cover_url = url
        body.description = description
        body.developers = devs
        body.genres = genres
        body.tags = tags
        body.source = 'api'

        return body
    };

    return (
        <div className='w-full h-fit bg-primary-700 rounded-2xl p-2'>
            <div>
                <div className='flex flex-col sm:flex-row gap-2'>
                <div id='lateral' className='flex flex-col items-center min-w-60 h-fit gap-2'>
                    <img className='h-100 min-w-60 max-w-60 center bg-cover bg-center object-cover object-center bg-no-repeat md:w-full rounded-2xl bg-primary-800/50 hover:bg-primary-800/70' src={url || null}></img>
                <input placeholder='URL da imagem' className='w-full h-8 pl-2 rounded-2xl bg-primary-800' onChange={(e) => setUrl(e.target.value)}></input>
                </div>

                <div id='principal' className='flex flex-col grow-2 h-fit gap-2'>
                    <input className='text-4xl font-extrabold w-full hover:bg-primary-800/30 focus:bg-primary-800/30 rounded-xl -ml-1 pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500' type="text" id="title" name="title" placeholder='Nome*' onChange={(e) => setName(e.target.value)}/>
                    <input type='date' className='text-2xl font-semibold w-fit hover:bg-primary-800/30 focus:bg-primary-800/30 rounded-xl -ml-1 pl-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500' onChange={(e) => setYear(e.target.value)}/>
                    
                    <div className='flex gap-2'>
                    <h2 className='text-primary-200 font-semibold text-lg uppercase tracking-wide'>Desenvolvedores</h2>
                    <button className='text-center align-middle rounded-2xl h-fit pl-1 pr-1 bg-primary-800 hover:bg-primary-800/70 cursor-pointer' onClick={() => setEditDevsWindow(true)}>+</button>
                    </div>
                    <div className='flex flex-wrap gap-2 justify-normal'>
                    {devs?.map((dev) => (
                        <div key={dev} className='flex border rounded-2xl text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200 gap-2 align-middle justify-center p-1 pl-2 pr-2'>
                        <p>{dev}</p>
                        </div>
                    ))}
                    </div>

                    <div className='flex gap-2'>
                    <h2 className='text-primary-200 font-semibold text-lg uppercase tracking-wide'>Gêneros</h2>
                    <button className='text-center align-middle rounded-2xl h-fit pl-1 pr-1 bg-primary-800 hover:bg-primary-800/70 cursor-pointer' onClick={() => setEditGenresWindow(true)}>+</button>
                    </div>
                    <div className='flex flex-wrap gap-2 justify-normal'>
                    {genres?.map((genre) => (
                        <div key={genre} className='flex border rounded-2xl text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200 gap-2 align-middle justify-center p-1 pl-2 pr-2'>
                        <p>{genre}</p>
                        </div>
                    ))}
                    </div>

                    <div className='flex gap-2'>
                    <h2 className='text-primary-200 font-semibold text-lg uppercase tracking-wide'>Tags</h2>
                    <button className='text-center align-middle rounded-2xl h-fit pl-1 pr-1 bg-primary-800 hover:bg-primary-800/70 cursor-pointer' onClick={() => setEditTagsWindow(true)}>+</button>
                    </div>
                    <div className='flex flex-wrap gap-2 justify-normal'>
                    {tags?.map((tag) => (
                        <div key={tag} className='flex border rounded-2xl text-center h-fit w-fit min-w-15 whitespace-nowrap text-primary-200 gap-2 align-middle justify-center p-1 pl-2 pr-2'>
                        <p>{tag}</p>
                        </div>
                    ))}
                    </div>

                    <div className="h-fit mb-2">
                    <h2 className="text-primary-200 font-bold text-lg mb-3 uppercase tracking-wide">DESCRIÇÃO</h2>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Escreva um resumo sobre o jogo..."
                        className="w-full min-h-45 p-5 rounded-2xl bg-primary-800/40 border border-primary-700/50 text-white placeholder:text-primary-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none leading-relaxed"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </div>
                </div>
            </div>
            <button className='w-full bg-primary-500 hover:bg-primary-300 h-10 rounded-2xl font-bold cursor-pointer' onClick={(e) => AdicionarJogo(e)}>Adicionar</button>
        </div>

        {editTagsWindow && (
            <div className='fixed flex z-10 p-2 left-0 top-0 w-full h-screen bg-primary-800/50 justify-center items-center backdrop-blur-sm'>
            <EditTagsWindow setEditTagsWindow={setEditTagsWindow} tags={tags} setTags={setTags}/>
            </div>
        )}
        {editGenresWindow && (
            <div className='fixed flex z-10 p-2 left-0 top-0 w-full h-screen bg-primary-800/50 justify-center items-center backdrop-blur-sm'>
            <EditGenresWindow setEditGenresWindow={setEditGenresWindow} genres={genres} setGenres={setGenres}/>
            </div>
        )}
        {editDevsWindow && (
            <div className='fixed flex z-10 p-2 left-0 top-0 w-full h-screen bg-primary-800/50 justify-center items-center backdrop-blur-sm'>
            <EditDevsWindow setEditDevsWindow={setEditDevsWindow} devs={devs} setDevs={setDevs}/>
            </div>
        )}
      </div>
    )
}