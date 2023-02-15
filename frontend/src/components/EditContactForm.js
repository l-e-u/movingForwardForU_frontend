import { useState } from "react";
import { useUpdateContact } from "../hooks/useUpdateContact.js";

// functions
import { noCharChanges } from "../utils/StringUtils.js";

// Form to create a contact for a job and description of what the contact means.
const EditContactForm = ({
    setShowThisForm,
    _id,
    name,
    address,
    billingAddress,
    organization,
    phoneNumber,
    phoneExt,
    note,
    email
}) => {
    const { updateContact, error, isLoading } = useUpdateContact()

    // local input state
    const [nameInput, setNameInput] = useState(name);
    const [addressInput, setAddressInput] = useState(address);
    const [billingAddressInput, setBillingAddressInput] = useState(billingAddress);
    const [organizationInput, setOrganizationInput] = useState(organization);
    const [emailInput, setEmailInput] = useState(email);
    const [phoneNumberInput, setPhoneNumberInput] = useState(phoneNumber);
    const [phoneExtInput, setPhoneExtInput] = useState(phoneExt);
    const [noteInput, setNoteInput] = useState(note);

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

    // every input doesn't allow extra spaces
    const handleOnChange = (stateSetter) => {
        return (e) => {
            const input = e.target.value;
            stateSetter(input.replace(/\s+/g, ' '));
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateContact({
            _id,
            name: nameInput,
            address: addressInput,
            billingAddress: billingAddressInput,
            organization: organizationInput,
            email: emailInput,
            note: noteInput,
            phoneNumber: phoneNumberInput,
            phoneExt: phoneExtInput
        });
    };

    return (
        <form className='mb-4' onSubmit={handleSubmit}>
            <h2>Edit Contact</h2>

            {/* ORGANIZATION */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'required form-control' + orgErrorClass}
                    name="organization"
                    id="organization"
                    placeholder="Organization"
                    value={organizationInput ?? ''}
                    onChange={handleOnChange(setOrganizationInput)} />
                <label htmlFor="organization" className="form-label">
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
                    onChange={(e) => setNameInput(e.target.value.replace(/\s+/g, ' '))}
                    value={nameInput ?? ''}
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
                    onChange={(e) => setAddressInput(e.target.value)}
                    value={addressInput ?? ''}
                />
                <label htmlFor="address" className="form-label">{'Address' + addrErrorMsg}</label>
            </div>

            {/* BILLING ADDRESS */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className='form-control'
                    name="billing"
                    placeholder="Billing Address"
                    id="billing"
                    onChange={(e) => setBillingAddressInput(e.target.value)}
                    value={billingAddressInput ?? ''}
                />
                <label htmlFor="address" className="form-label">Billing Address</label>
            </div>

            {/* EMAIL */}
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className={'form-control' + emailErrorClass}
                    id="email"
                    placeholder="name@example.com"
                    value={emailInput ?? ''}
                    onChange={(e) => setEmailInput(e.target.value)} />
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
                        onChange={(e) => setPhoneNumberInput(e.target.value)}
                        value={phoneNumberInput ?? ''}
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
                        onChange={(e) => setPhoneExtInput(e.target.value)}
                        value={phoneExtInput ?? ''}
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
                    onChange={(e) => setNoteInput(e.target.value)}
                    value={noteInput ?? ''}
                    style={{ height: '100px' }}
                ></textarea>
                <label htmlFor="note" className="form-label">Note</label>
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => setShowThisForm(false)}>Cancel</button>

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

export default EditContactForm;