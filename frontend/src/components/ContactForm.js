// components
import RequiredFieldsText from './RequiredFieldsText';
import GrowingTextArea from './GrowingTextArea';

// functions
import { removeExtraSpaces } from '../utils/StringUtils';

const ContactForm = ({ contact, setContact, handleSubmit, error, isDisabled }) => {
    const { name, misc, address, billingAddress, organization, email, phoneNumber, phoneExt } = contact;

    // error identification on fields with validation
    const errorFromOrganizationInput = error?.organization;
    const errorFromAddressInput = error?.address;
    const errorFromEmailInput = error?.email;
    const errorFromPhoneNumberInput = error?.phoneNumber;
    const errorFromPhoneExtInput = error?.phoneExt;
    const errorOther = error?.server;

    return (
        <form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
            <RequiredFieldsText />

            {/* ORGANIZATION */}
            <div className='form-floating'>
                <input
                    type='text'
                    className={'form-control' + (errorFromOrganizationInput ? ' is-invalid' : '')}
                    name='organization'
                    id='organization'
                    placeholder='Organization'
                    value={organization ?? ''}
                    onChange={(e) => {
                        setContact(prev => {
                            return {
                                ...prev,
                                organization: removeExtraSpaces(e.target.value)
                            }
                        })
                    }}
                    onBlur={(e) => {
                        setContact(prev => {
                            return {
                                ...prev,
                                organization: e.target.value.trim()
                            }
                        })
                    }} />
                <label htmlFor='organization' className='form-label required'>
                    Organization
                    {errorFromOrganizationInput && <span className='inputError'>{error.organization.message}</span>}
                </label>
            </div>

            <div className='d-flex flex-column flex-lg-row gap-2'>
                {/* ADDRESS */}
                <div className='form-floating flex-grow-1'>
                    <input
                        type='text'
                        className={'form-control' + (errorFromAddressInput ? ' is-invalid' : '')}
                        name='address'
                        placeholder='Address'
                        id='address'
                        value={address ?? ''}
                        onChange={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    address: removeExtraSpaces(e.target.value)
                                }
                            })
                        }}
                        onBlur={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    address: e.target.value.trim()
                                }
                            })
                        }} />
                    <label htmlFor='address' className='form-label required'>
                        Address
                        {errorFromAddressInput && <span className='inputError'>{error.address.message}</span>}
                    </label>
                </div>

                {/* BILLING ADDRESS */}
                <div className='form-floating flex-grow-1'>
                    <input
                        type='text'
                        className='form-control'
                        name='billing'
                        placeholder='Billing Address'
                        id='billing'
                        value={billingAddress ?? ''}
                        onChange={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    billingAddress: removeExtraSpaces(e.target.value)
                                }
                            })
                        }}
                        onBlur={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    billingAddress: e.target.value.trim()
                                }
                            })
                        }} />
                    <label htmlFor='address' className='form-label'>Billing Address</label>
                </div>
            </div>

            <div className='d-flex flex-wrap gap-2'>
                {/* NAME */}
                <div className='form-floating' style={{ flex: '1 1 400px' }}>
                    <input
                        type='text'
                        className='form-control'
                        name='name'
                        id='name'
                        placeholder='Name'
                        value={name ?? ''}
                        onChange={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    name: removeExtraSpaces(e.target.value)
                                }
                            })
                        }}
                        onBlur={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    name: e.target.value.trim()
                                }
                            })
                        }} />
                    <label htmlFor='name' className='form-label'>Name</label>
                </div>

                {/* EMAIL */}
                <div className='form-floating' style={{ flex: '1 1 400px' }}>
                    <input
                        type='email'
                        className={'form-control' + (errorFromEmailInput ? ' is-invalid' : '')}
                        id='email'
                        placeholder='name@example.com'
                        value={email ?? ''}
                        onChange={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    email: removeExtraSpaces(e.target.value)
                                }
                            })
                        }}
                        onBlur={(e) => {
                            setContact(prev => {
                                return {
                                    ...prev,
                                    email: e.target.value.trim()
                                }
                            })
                        }} />
                    <label htmlFor='email' className='form-label'>
                        Email
                        {errorFromEmailInput && <span className='inputError'>{error.email.message}</span>}
                    </label>
                </div>

                <div className='d-flex flex-column flex-sm-row gap-2' style={{ flex: '1 1 300px' }}>
                    {/* PHONE NUMBER */}
                    <div className='form-floating flex-grow-1'>
                        <input
                            type='text'
                            className={'form-control' + (errorFromPhoneNumberInput ? ' is-invalid' : '')}
                            name='phoneNumber'
                            placeholder='Phone'
                            id='phoneNumber'
                            value={phoneNumber ?? ''}
                            onChange={(e) => {
                                setContact(prev => {
                                    return {
                                        ...prev,
                                        phoneNumber: removeExtraSpaces(e.target.value)
                                    }
                                })
                            }}
                            onBlur={(e) => {
                                setContact(prev => {
                                    return {
                                        ...prev,
                                        phoneNumber: e.target.value.trim()
                                    }
                                })
                            }} />
                        <label htmlFor='phoneNumber' className='form-label'>
                            Phone
                            {errorFromPhoneNumberInput && <span className='inputError'>{error.phoneNumber.message}</span>}
                        </label>
                    </div>

                    {/* PHONE EXT */}
                    <div className='form-floating'>
                        <input
                            type='number'
                            min={0}
                            className={'form-control' + (errorFromPhoneExtInput ? ' is-invalid' : '')}
                            name='phoneExt'
                            placeholder='Ext'
                            id='phoneExt'
                            value={phoneExt ?? ''}
                            onChange={(e) => {
                                setContact(prev => {
                                    return {
                                        ...prev,
                                        phoneExt: removeExtraSpaces(e.target.value)
                                    }
                                })
                            }}
                            onBlur={(e) => {
                                setContact(prev => {
                                    return {
                                        ...prev,
                                        phoneExt: e.target.value.trim()
                                    }
                                })
                            }} />
                        <label htmlFor='PhoneExt' className='form-label'>
                            Ext
                            {errorFromPhoneExtInput && <span className='inputError'>{error.phoneExt.message}</span>}
                        </label>
                    </div>
                </div>
            </div>

            {/* MISC */}
            <div className='form-floating'>
                <GrowingTextArea
                    className='form-control'
                    name='miscTextarea'
                    onChange={e => setContact(prev => {
                        return { ...prev, misc: e.target.value };
                    })}
                    placeholder='Miscellaneous'
                    value={misc}
                />
                <label htmlFor='miscTextarea' className='form-label'>Miscellaneous</label>
            </div>

            <button
                type='submit'
                disabled={isDisabled}
                className='btn btn-sm btn-success rounded-pill px-3 d-flex ms-auto'>
                Save
            </button>

            {/* any errors other than input validation */}
            {errorOther && <div className='text-danger mt-3'>{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default ContactForm;