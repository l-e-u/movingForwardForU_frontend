import { useState } from 'react';
import { Link, useLinkClickHandler } from 'react-router-dom';

const NavbarAdmin = () => {
    const [selected, setSelected] = useState(0);
    const links = [
        { name: 'My Jobs', path: '/' },
        { name: 'All Jobs', path: '/' },
        { name: 'Contacts', path: '/' },
        { name: 'Statuses', path: '/statuses' },
        { name: 'Users', path: '/' },
    ];


    return (
        <nav className='admin'>
            {links.map((link, index) => {
                return (
                    <Link
                        key={index}
                        to={link.path}
                        className={selected === index ? 'selected' : ''}
                        onClick={() => setSelected(index)}
                    >
                        {link.name}
                    </Link>
                )
            })}
        </nav>
    )
};

export default NavbarAdmin;