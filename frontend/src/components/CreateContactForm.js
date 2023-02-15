import { useState } from "react";
import { useCreateContact } from "../hooks/useCreateContact.js";

// functions
import { noCharChanges } from "../utils/StringUtils.js";

// Form to create a contact for a job and description of what the contact means.
const CreateContactForm = ({ isShowing, setShow }) => {
    const { createContact, error, isLoading } = useCreateContact();

    // local state is undefined by default so when the user edits a contact, the server only updates the fields that have a value
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [organization, setOrganization] = useState('');
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneExt, setPhoneExt] = useState('');
    const [note, setNote] = useState('');

    // const nameNoExtraSpacesAndTrimmed = name.replace(/\s+/g, ' ').trim();
    // const descNoExtraSpacesAndTrimmed = description.replace(/\s+/g, ' ').trim();

    // error classes
    let orgErrorClass = '';
    let addrErrorClass = '';
    let phoneNumberErrorClass = '';
    let phoneExtErrorClass = '';
    let emailErrorClass = ''

    // error messages
    let orgErrorMsg;
    let addrErrorMsg = '';
    let phoneNumberErrorMsg = '';
    let phoneExtErrorMsg = '';
    let emailErrorMsg;

    // handles errors thrown by failed validations on models
    if (error && error.errors) {
        const { errors } = error;
        const { organization, address, email, phoneNumber, phoneExt } = errors;

        if (organization) {
            orgErrorClass = ' is-invalid';
            orgErrorMsg = ': ' + errors.organization.message;
        };

        if (address) {
            addrErrorClass = ' is-invalid';
            addrErrorMsg = ': ' + errors.address.message;
        };

        if (phoneNumber) {
            phoneNumberErrorClass = ' is-invalid';
            phoneNumberErrorMsg = ': ' + phoneNumber.message;
        };

        if (phoneExt) {
            phoneExtErrorClass = ' is-invalid';
            phoneExtErrorMsg = ': ' + phoneExt.message;
        };

        if (email) {
            emailErrorClass = ' is-invalid';
            emailErrorMsg = ': ' + email.message;
        };
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
            <h2>Add a New Contact</h2>

            <p className="text-danger w-100 text-end"> <small>* Required fields</small></p>

            {/* ORGANIZATION */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'required form-control' + orgErrorClass}
                    name="organization"
                    id="organization"
                    placeholder="Organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)} />
                <label htmlFor="organization" className="form-label required">
                    Organization
                    {orgErrorMsg && <span className="ms-1 text-danger">{orgErrorMsg}</span>}
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
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <label htmlFor="name" className="form-label">Name</label>
            </div>

            {/* ADDRESS */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'form-control' + addrErrorClass}
                    name="address"
                    placeholder="Address"
                    id="address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                />
                <label htmlFor="address" className="form-label required">{'Address' + addrErrorMsg}</label>
            </div>

            {/* EMAIL */}
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className={'form-control' + emailErrorClass}
                    id="email"
                    placeholder="name@example.com"
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">
                    Email
                    {emailErrorMsg && <span className="ms-1 text-danger">{emailErrorMsg}</span>}
                </label>
            </div>

            {/* PHONE NUMBER AND EXT */}
            <div className="d-flex gap-3 mb-3">
                <div className="form-floating w-75">
                    <input
                        type="text"
                        className={'form-control' + phoneNumberErrorClass}
                        name="phoneNumber"
                        placeholder="Phone"
                        id="phoneNumber"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                    />
                    <label htmlFor="phoneNumber" className="form-label">{'Phone' + phoneNumberErrorMsg}</label>
                </div>
                <div className="form-floating w-25">
                    <input
                        type="number"
                        min={0}
                        className={'form-control' + phoneExtErrorClass}
                        name="phoneExt"
                        placeholder="Ext"
                        id="phoneExt"
                        onChange={(e) => setPhoneExt(e.target.value)}
                        value={phoneExt}
                    />
                    <label htmlFor="PhoneExt" className="form-label">{'Ext' + phoneExtErrorMsg}</label>
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
                    onChange={(e) => setNote(e.target.value)}
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
                    className='btn btn-sm btn-success rounded-pill px-3'>Save</button>
            </div>

            {/* any errors other than name and description input validation */}
            {(error && !error.errors) && <div className="text-danger mt-3">{error.name || error.message + ' Refresh page. If problem persists, contact developer.'}</div>}
        </form>
    );
};

export default CreateContactForm;