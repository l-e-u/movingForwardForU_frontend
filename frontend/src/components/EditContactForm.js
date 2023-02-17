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
    const [nameInput, setNameInput] = useState(name ?? '');
    const [addressInput, setAddressInput] = useState(address ?? '');
    const [billingAddressInput, setBillingAddressInput] = useState(billingAddress ?? '');
    const [organizationInput, setOrganizationInput] = useState(organization ?? '');
    const [emailInput, setEmailInput] = useState(email ?? '');
    const [phoneNumberInput, setPhoneNumberInput] = useState(phoneNumber ?? '');
    const [phoneExtInput, setPhoneExtInput] = useState(phoneExt ?? '');
    const [noteInput, setNoteInput] = useState(note ?? '');

    // error identification for inputs with validators
    const errorFromAddressInput = (error && error.address);
    const errorFromOrganizationInput = (error && error.organization);
    const errorFromEmailInput = (error && error.email);
    const errorFromPhoneNumberInput = (error && error.phoneNumber);
    const errorFromPhoneExtInput = (error && error.phoneExt);

    // user cannot update a doc that has not character changes, this disables the update button
    const noChanges = [
        [name, nameInput],
        [address, addressInput],
        [billingAddress, billingAddressInput],
        [organization, organizationInput],
        [email, emailInput],
        [phoneNumber, phoneNumberInput],
        [phoneExt, phoneExtInput],
        [note, noteInput]
    ].every(strings => noCharChanges(strings[0], strings[1]));

    // when the input loses focus it trims the input to reflect the value sent to the backend
    const handleOnBlurTrimInput = (stateSetter) => {
        return () => stateSetter(input => input.trim());
    };

    // every input doesn't allow extra spaces
    const handleOnChangeRemoveExtraSpaces = (stateSetter) => {
        return (e) => stateSetter(e.target.value.replace(/\s+/g, ' '));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await updateContact({
            _id,
            contact: {
                name: nameInput,
                address: addressInput,
                billingAddress: billingAddressInput,
                organization: organizationInput,
                email: emailInput,
                note: noteInput,
                phoneNumber: phoneNumberInput,
                phoneExt: phoneExtInput
            }
        });
    };

    return (
        <form className='mb-4' onSubmit={handleSubmit}>
            <h2>Edit Contact</h2>

            {/* ORGANIZATION */}
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className={'required form-control' + (errorFromOrganizationInput ? ' is-invalid' : '')}
                    name="organization"
                    id="organization"
                    placeholder="Organization"
                    value={organizationInput}
                    onChange={handleOnChangeRemoveExtraSpaces(setOrganizationInput)}
                    onBlur={handleOnBlurTrimInput(setOrganizationInput)} />
                <label htmlFor="organization" className="form-label">
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
                    onChange={handleOnChangeRemoveExtraSpaces(setNameInput)}
                    value={nameInput}
                    onBlur={handleOnBlurTrimInput(setNameInput)}
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
                    onChange={handleOnChangeRemoveExtraSpaces(setAddressInput)}
                    value={addressInput}
                    onBlur={handleOnBlurTrimInput(setAddressInput)}
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
                    onChange={handleOnChangeRemoveExtraSpaces(setBillingAddressInput)}
                    value={billingAddressInput}
                    onBlur={handleOnBlurTrimInput(setBillingAddressInput)} />
                <label htmlFor="address" className="form-label">Billing Address</label>
            </div>

            {/* EMAIL */}
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className={'form-control' + (errorFromEmailInput ? ' is-invalid' : '')}
                    id="email"
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={handleOnChangeRemoveExtraSpaces(setEmailInput)}
                    onBlur={handleOnBlurTrimInput(setEmailInput)} />
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
                        onChange={handleOnChangeRemoveExtraSpaces(setPhoneNumberInput)}
                        onBlur={handleOnBlurTrimInput(setPhoneNumberInput)}
                        value={phoneNumberInput} />
                    <label htmlFor="phoneNumber" className="form-label">
                        Phone
                        {errorFromPhoneNumberInput && <span className="ms-1 text-danger">{error.phoneNumber.message}</span>}
                    </label>
                </div>
                <div className="form-floating w-25">
                    <input
                        type="number"
                        min={0}
                        className={'form-control' + (errorFromPhoneExtInput ? ' is-invalid' : '')}
                        name="phoneExt"
                        placeholder="Ext"
                        id="phoneExt"
                        onChange={handleOnChangeRemoveExtraSpaces(setPhoneExtInput)}
                        onBlur={handleOnBlurTrimInput(setPhoneExtInput)}
                        value={phoneExtInput}
                    />
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
                    onChange={handleOnChangeRemoveExtraSpaces(setNoteInput)}
                    value={noteInput}
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
                    disabled={isLoading || noChanges}
                    className='btn btn-sm btn-success rounded-pill px-3'>Update</button>
            </div>

            {/* any errors other than input validation */}
            {(error && error.server) && <div className="text-danger mt-3">{`${error.server.message} Refresh page. If problem persists, contact developer.`}</div>}
        </form>
    );
};

export default EditContactForm;