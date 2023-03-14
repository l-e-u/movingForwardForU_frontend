import { Link } from 'react-router-dom';

const Navbar = ({ user, setShowNavMenu, setSelectedLink }) => {
    return (
        <header className='mx-auto maxWidth1400px px-lg-3'>
            <div
                className='d-flex py-3 px-4 theme-light align-items-center justify-content-between'
                style={{ borderBottomRightRadius: 'var(--bs-border-radius', borderBottomLeftRadius: 'var(--bs-border-radius' }}>
                {user &&
                    <h1 className='m-0'>
                        <i className='bi bi-list text-green' onClick={() => {
                            setShowNavMenu(true);
                        }}></i>
                    </h1>
                }
                <Link to='/' className='text-reset text-decoration-none ms-auto' onClick={() => setSelectedLink(0)}>
                    <h1 className='m-0'>Moving Forward</h1>
                </Link>
            </div>
        </header>
    )
}

export default Navbar;