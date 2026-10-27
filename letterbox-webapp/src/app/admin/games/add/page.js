
import NavBarAdmin from '@/components/admin/NavBarAdmin';
import AddGameAPI from '@/components/admin/AddGames/AddGameAPI';
import AddGameRAWG from '@/components/admin/AddGames/AddGameRAWG';

export default function AddGamePage() {

  return (
    <div className='flex flex-col place-items-center mt-2 w-full max-w-6xl mx-auto gap-2'>
      <NavBarAdmin/>

      <AddGameAPI />

      <h1 className='flex justify-center w-full bg-primary-700 rounded-2xl p-2 font-bold gap-1'>Adicionar via<p className='bg-black pl-1 pr-1 rounded-xl'>API RAWG</p></h1>

      <AddGameRAWG />
    </div>
  )
};