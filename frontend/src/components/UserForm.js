// functions
import { removeExtraSpaces } from '../utils/StringUtils';

// components
import RequiredFieldsText from './RequiredFieldsText';
import GrowingTextArea from './GrowingTextArea';

const UserForm = ({
    error,
    handleSubmit,
    isDisabled,
    setUser,
    user,
    isEditing = false,
}) => {
    const errorFromEmailInput = error?.email;
    const errorFromFirstNameInput = error?.firstName;
    const errorFromLastNameInput = error?.lastName;

    return (
        <form onSubmit={handleSubmit}>
            <RequiredFieldsText />

            {/* Deactivating a user only happens when editing the doc */}
            {isEditing && <div className='form-check'>
                <input
                    type='checkbox'
                    className='form-check-input'
                    id='activeCheck'
                    checked={user.isActive}
                    onChange={() => {
                        setUser(prev => {
                            return {
                                ...prev,
                                isActive: !prev.isActive
                            }
                        })
                    }} />
                <label className='form-check-label' htmlFor='activeCheck'>Active</label>
            </div>}

            <div className='form-check'>
                <input
                    type='checkbox'
                    className='form-check-input'
                    id='adminCheck'
                    checked={user.isAdmin}
                    onChange={() => {
                        setUser(prev => {
                            return {
                                ...prev,
                                isAdmin: !prev.isAdmin
                            }
                        })
                    }} />
                <label className='form-check-label' htmlFor='adminCheck'>Administrator</label>
                <br />
                <small className='text-secondary'>A user with administrator privileges will be able to create, edit , and delete all documents. </small>
            </div>


            {/* NAME */}
            <div className='form-floating'>
                <input
                    type='text'
                    className={'form-control' + (errorFromFirstNameInput ? ' is-invalid' : '')}
                    name='firstName'
                    id='firstName'
                    placeholder='First Name'
                    value={user.firstName}
                    onChange={e => {
                        setUser(prev => {
                            return {
                                ...prev,
                                firstName: e.target.value
                            }
                        })
                    }}
                    onBlur={e => {
                        setUser(prev => {
                            return {
                                ...prev,
                                firstName: removeExtraSpaces(e.target.value.trim())
                            }
                        })
                    }} />
                <label htmlFor='firstName' className='form-label required'>
                    First Name
                    {errorFromFirstNameInput && <span className='inputError'>{error.firstName.message}</span>}
                </label>
            </div>

            <div className='form-floating'>
                <input
                    type='text'
                    className={'form-control' + (errorFromLastNameInput ? ' is-invalid' : '')}
                    name='lastName'
                    id='lastName'
                    placeholder='Last Name'
                    value={user.lastName}
                    onChange={e => {
                        setUser(prev => {
                            return {
                                ...prev,
                                lastName: e.target.value
                            }
                        })
                    }}
                    onBlur={e => {
                        setUser(prev => {
                            return {
                                ...prev,
                                lastName: removeExtraSpaces(e.target.value.trim())
                            }
                        })
                    }} />
                <label htmlFor='lastName' className='form-label required'>
                    Last Name
                    {errorFromLastNameInput && <span className='inputError'>{error.lastName.message}</span>}
                </label>
            </div>

            {/* EMAIL */}
            <div className='form-floating'>
                <input
                    type='email'
                    className={'form-control' + (errorFromEmailInput ? ' is-invalid' : '')}
                    id='email'
                    placeholder='name@example.com'
                    value={user.email}
                    onChange={(e) => {
                        setUser(prev => {
                            return {
                                ...prev,
                                email: e.target.value
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setUser(prev => {
                            return {
                                ...prev,
                                email: removeExtraSpaces(e.target.value.trim())
                            }
                        })
                    }} />
                <label htmlFor='email' className='form-label required'>
                    Email
                    {errorFromEmailInput && <span className='inputError'>{error.email.message}</span>}
                </label>
            </div>

            {/* COMMENTS */}
            <div className='form-floating'>
                <GrowingTextArea
                    className='form-control'
                    name='commentsTextarea'
                    onChange={e => setUser(prev => {
                        return { ...prev, comments: e.target.value };
                    })}
                    placeholder='Comments'
                    value={user.comments}
                />
                <label htmlFor='commentsTextarea' className='form-label'>Comments</label>
            </div>

            <button
                type='submit'
                disabled={isDisabled}
                className='btn btn-sm btn-success rounded-pill px-3 d-flex mt-4 ms-auto'>
                Save
            </button>
        </form>
    );
};

export default UserForm;