import { useState } from 'react';
import { Link } from 'react-router-dom';

const NavbarAdmin = () => {
    const [selected, setSelected] = useState(0);
    const links = [
        'My Jobs',
        'All Jobs',
        'Contacts',
        'Statuses',
        'Users'
    ];

    return (
        <nav className='admin'>
            {links.map((link, index) => {
                return (
                    <Link
                        key={index}
                        to='/statuses'
                        className={selected === index ? 'selected' : ''}
                        onClick={() => setSelected(index)}
                    >
                        {link}
                    </Link>
                )
            })}
        </nav>
    )
};

export default NavbarAdmin;