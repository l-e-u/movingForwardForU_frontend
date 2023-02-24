import { Link } from 'react-router-dom';

const Navbar = ({ user, setShowNavMenu, setSelectedLink }) => {
    return (
        <header className='mx-auto maxWidth1400px px-lg-4'>
            <div
                className='d-flex py-3 px-4 theme-light align-items-center justify-content-between'
                style={{ borderBottomRightRadius: 'var(--bs-border-radius', borderBottomLeftRadius: 'var(--bs-border-radius' }}>
                {user &&
                    <h1 className='m-0'>
                        <i className='bi bi-list' onClick={() => {
                            setShowNavMenu(true);
                        }}></i>
                    </h1>
                }
                <Link to='/' className='text-reset text-decoration-none ms-auto' onClick={() => setSelectedLink(0)}>
                    <h1 className='m-0'>Moving Forward</h1>
                </Link>
            </div>

            {/* new menu dev */}
            {/* <nav className={'position-fixed position-lg-relative d-flex top-0 start-0 w-100 h-100 menu' + (showMenu ? ' show' : ' d-none')}>
                <div className='theme-light d-flex flex-column w-75 w-sm-50 p-4 overflow-auto'>
                    {user &&
                        <div className='border-bottom py-3'>
                            <p className='text-center m-0'>{user.firstName}</p>
                        </div>
                    }

                    {isAdmin && links.map((link, index) => {
                        return (
                            <Link
                                key={index}
                                to={link.path}
                                className={(selected === index ? 'selected' : '') + ' text-decoration-none text-reset my-4 py-2 px-4'}
                                onClick={() => {
                                    setSelected(index);
                                    setShowMenu(false);
                                }}>
                                <i className={'pe-3 bi ' + link.icon}></i><span>{link.name}</span>
                            </Link>
                        )
                    })
                    }

                    <button
                        type='button'
                        className='d-flex mx-auto mt-auto btn btn-danger btn-sm rounded-pill px-3'
                        onClick={handleLogoutClick}>
                        Log out
                    </button>
                </div>
                <div className='w-25 w-sm-50 h-100 background' onClick={() => setShowMenu(false)}></div>
            </nav> */}
        </header>
    )
}

export default Navbar;