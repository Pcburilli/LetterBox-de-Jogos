
import NavBarAdmin from '@/components/admin/NavBarAdmin';

export default function AdminPage() {

  return (
    <div className='grid place-items-center mt-2 w-full max-w-6xl mx-auto gap-2'>
      <NavBarAdmin/>
      <div>
        Dashboard para admin.
      </div>
    </div>
  )
};