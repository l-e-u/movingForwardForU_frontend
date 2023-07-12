import { Link } from 'react-router-dom';

const Navbar = ({ user, setShowNavMenu, setSelectedLink }) => {
    return (
        <header className='mx-auto maxWidth1400px px-lg-3'>
            <div
                className='d-flex py-3 px-4 background-white align-items-center justify-content-between'
                style={{ borderBottomRightRadius: 'var(--bs-border-radius', borderBottomLeftRadius: 'var(--bs-border-radius' }}>
                {user &&
                    <i className='bi bi-list text-action fs-4' onClick={() => {
                        setShowNavMenu(true);
                    }}></i>
                }
                <Link to='/' className='text-reset text-decoration-none ms-auto' onClick={() => setSelectedLink(0)}>
                    <h1 className='m-0'>Moving Forward</h1>
                </Link>
            </div>
        </header>
    )
}

export default Navbar;