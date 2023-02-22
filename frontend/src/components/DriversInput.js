import { useEffect, useState } from 'react';
import { useUsersContext } from '../hooks/useUsersContext';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

// datalist for drivers. added drivers aprear below the input and are unique. it has the option to remove them too.
const DriversInput = ({ drivers, setJob, token }) => {
    const { users, dispatch } = useUsersContext();
    const [error, setError] = useState(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/users', {
                headers: {
                    'Authentication': `Bearer ${token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_USERS', payload: json });
            };

            if (!response.ok) {
                console.error(json);
            };
        };

        fetchUsers();
    }, [dispatch]);

    // checks for email in input or selected value from user. adds user to drivers
    const handleOnChange = (e) => {
        const pattern = /\S+@\S+\.\S+/;
        const input = removeExtraSpaces(e.target.value);
        const email = input.match(pattern);

        // upon input, start off without errors
        setError(null);

        // set and return if input is not an email
        if (!email) {
            setInput(input);
            return;
        };

        // if input is an email, look for user with that email, return if no user exists
        const user = users.find(u => u.email === email[0]);

        if (!user) {
            setInput(input);
            return;
        };

        const hasThisDriver = drivers.some(u => u._id === user._id);

        // same driver cannot be added twice for same job
        if (hasThisDriver) {
            setError('Already added.');
            setInput(input);
            return;
        };

        if (user) {
            setJob(prev => {
                return {
                    ...prev,
                    drivers: [...prev.drivers, user]
                }
            });
            setInput('');
        };
    };

    return (
        <div className='form-floating'>
            <input
                type='text'
                className={'form-select' + (error ? ' is-invalid' : '')}
                list='userDataList'
                aria-label='Drivers'
                name='drivers'
                id='drivers'
                placeholder='Search or select...'
                value={input}
                onChange={handleOnChange} />
            <label htmlFor='drivers' className='form-label'>
                Drivers
                {error && <span className='inputError'>{error}</span>}
            </label>
            <datalist id='userDataList'>
                {users && users.map(u => {
                    const { _id, firstName, lastName, email } = u;
                    const value = `${firstName} ${lastName} - ${email}`;

                    return <option key={_id} value={value}>{value}</option>
                })}
            </datalist>

            {(drivers.length > 0) &&
                <ul className='list-unstyled d-flex flex-wrap mt-3 mb-0'>
                    {drivers.map(d => {
                        const { _id, firstName, lastName } = d;
                        const name = `${firstName} ${lastName.charAt(0)}.`;

                        return (
                            < li key={d._id} className='border theme-light py-1 px-3 rounded-pill me-4 mb-2' >
                                {name}
                                <button
                                    type='button'
                                    className='btn border-0 py-0 ps-4 pe-1'
                                    onClick={() => {
                                        setJob(prev => {
                                            return {
                                                ...prev,
                                                drivers: drivers.filter(d => d._id != _id)
                                            }
                                        })
                                    }}>
                                    < i className='bi bi-x'></i>
                                </button>
                            </li>
                        )
                    })
                    }
                </ul >
            }
        </div >
    );
};

export default DriversInput;