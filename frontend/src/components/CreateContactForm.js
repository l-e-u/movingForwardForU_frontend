import { useState } from "react";
import { useCreateContact } from "../hooks/useCreateContact.js";

// Form to create a contact for a job and description of what the contact means.
const CreateContactForm = ({ isShowing, setShow }) => {
    const { createContact, error, isLoading } = useCreateContact();

    // local state
    const [address, setAddress] = useState('');
    const [organization, setOrganization] = useState('');
    const [name, setName] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneExt, setPhoneExt] = useState('');
    const [note, setNote] = useState('');

    // error identification for inputs with validators
    const errorFromAddressInput = (error && error.address);
    const errorFromOrganizationInput = (error && error.organization);
    const errorFromEmailInput = (error && error.email);
    const errorFromPhoneNumberInput = (error && error.phoneNumber);
    const errorFromPhoneExtInput = (error && error.phoneExt);

    // input does not allow extra spaces
    const handleOnChangeRemoveExtraSpaces = (stateSetter) => {
        return (e) => stateSetter(e.target.value.replace(/\s+/g, ' '));
    };

    // when the input loses focus it trims the input to reflect the value sent to the backend
    const handleOnBlurTrimInput = (stateSetter) => {
        return () => stateSetter(input => input.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createContact({
            name,
            address,
            billingAddress,
            organization,
            email,
            note,
            phoneNumber,
            phoneExt
        });
    };

    return (
        <form className='mb-4' onSubmit={handleSubmit}>
            <h2>New Contact</h2>

            <p className="text-danger w-100 text-end"> <small>* Required fields</small></p>

            {/* ORGANIZATION */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'required form-control' + (errorFromOrganizationInput ? ' is-invalid' : '')}
                    name="organization"
                    id="organization"
                    placeholder="Organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    onBlur={handleOnBlurTrimInput(setOrganization)} />
                <label htmlFor="organization" className="form-label required">
                    Organization
                    {errorFromOrganizationInput && <span className="ms-1 text-danger">{error.organization.message}</span>}
                </label>
            </div>

            {/* NAME */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className='form-control'
                    name="name"
                    id="name"
                    placeholder="Name"
                    onChange={handleOnChangeRemoveExtraSpaces(setName)}
                    value={name}
                    onBlur={handleOnBlurTrimInput(setName)}
                />
                <label htmlFor="name" className="form-label">Name</label>
            </div>

            {/* ADDRESS */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'form-control' + (errorFromAddressInput ? ' is-invalid' : '')}
                    name="address"
                    placeholder="Address"
                    id="address"
                    onChange={handleOnChangeRemoveExtraSpaces(setAddress)}
                    value={address}
                    onBlur={handleOnBlurTrimInput(setAddress)}
                />
                <label htmlFor="address" className="form-label required">
                    Address
                    {errorFromAddressInput && <span className="ms-1 text-danger">{error.organization.address}</span>}
                </label>
            </div>

            {/* BILLING ADDRESS */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className='form-control'
                    name="billing"
                    placeholder="Billing Address"
                    id="billing"
                    onChange={handleOnChangeRemoveExtraSpaces(setBillingAddress)}
                    value={billingAddress}
                    onBlur={handleOnBlurTrimInput(setBillingAddress)} />
                <label htmlFor="address" className="form-label">Billing Address</label>
            </div>

            {/* EMAIL */}
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className={'form-control' + (errorFromEmailInput ? ' is-invalid' : '')}
                    id="email"
                    placeholder="name@example.com"
                    value={email || ''}
                    onChange={handleOnChangeRemoveExtraSpaces(setEmail)}
                    onBlur={handleOnBlurTrimInput(setEmail)} />
                <label htmlFor="email">
                    Email
                    {errorFromEmailInput && <span className="ms-1 text-danger">{error.email.message}</span>}
                </label>
            </div>

            {/* PHONE NUMBER AND EXT */}
            <div className="d-flex gap-3 mb-3">
                <div className="form-floating w-50">
                    <input
                        type="text"
                        className={'form-control' + (errorFromPhoneNumberInput ? ' is-invalid' : '')}
                        name="phoneNumber"
                        placeholder="Phone"
                        id="phoneNumber"
                        onChange={handleOnChangeRemoveExtraSpaces(setPhoneNumber)}
                        onBlur={handleOnBlurTrimInput(setPhoneNumber)}
                        value={phoneNumber} />
                    <label htmlFor="phoneNumber" className="form-label">
                        Phone
                        {errorFromPhoneNumberInput && <span className="ms-1 text-danger">{error.phoneNumber.message}</span>}
                    </label>
                </div>
                <div className="form-floating w-50">
                    <input
                        type="number"
                        min={0}
                        className={'form-control' + (errorFromPhoneExtInput ? ' is-invalid' : '')}
                        name="phoneExt"
                        placeholder="Ext"
                        id="phoneExt"
                        onChange={handleOnChangeRemoveExtraSpaces(setPhoneExt)}
                        value={phoneExt}
                        onBlur={handleOnBlurTrimInput(setPhoneExt)} />
                    <label htmlFor="PhoneExt" className="form-label">
                        Ext
                        {errorFromPhoneExtInput && <span className="ms-1 text-danger">{error.phoneExt.message}</span>}
                    </label>
                </div>
            </div>

            {/* NOTE */}
            <div className="form-floating mb-3">
                <textarea
                    type="text"
                    className='form-control'
                    name="note"
                    placeholder="Note"
                    id="note"
                    onChange={handleOnChangeRemoveExtraSpaces(setNote)}
                    onBlur={handleOnBlurTrimInput(setNote)}
                    value={note}
                    style={{ height: '100px' }}
                ></textarea>
                <label htmlFor="note" className="form-label">Note</label>
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => setShow(!isShowing)}>Cancel</button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className='btn btn-sm btn-success rounded-pill px-3'>Create</button>
            </div>

            {/* any errors other than input validation */}
            {(error && error.server) && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default CreateContactForm;