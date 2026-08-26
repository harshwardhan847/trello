
import OrgSelector from './OrgSelector';
import Profile from './Profile';

type Props = {}

const NavBar = (props: Props) => {

    return (
        <nav className='w-full bg-white/30 border backdrop-blur-sm p-4 px-2 md:px-8 flex items-center justify-between'>
            <div className='flex gap-4'>

                <h2 className='text-brand font-black text-2xl'>Trello</h2>
                <OrgSelector />
            </div>

            <Profile />
        </nav>
    )
}

export default NavBar