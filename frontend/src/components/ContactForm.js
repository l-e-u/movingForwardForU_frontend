import { useState } from "react";
import { useContactsContext } from "../hooks/useContactsContext.js";

// Form creates a contact card for a customer
const ContactForm = () => {
    const { contacts, dispatch } = useContactsContext();

    const [organization, setOrganization] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [street1, setStreet1] = useState('');
    const [street2, setStreet2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');

    // state for errors
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const states = new Map([
        ["AL", "Alabama"],
        ["AK", "Alaska"],
        ["AZ", "Arizona"],
        ["AR", "Arkansas"],
        ["CA", "California"],
        ["CO", "Colorado"],
        ["CT", "Connecticut"],
        ["DE", "Delaware"],
        ["DC", "District Of Columbia"],
        ["FL", "Florida"],
        ["GA", "Georgia"],
        ["HI", "Hawaii"],
        ["ID", "Idaho"],
        ["IL", "Illinois"],
        ["IN", "Indiana"],
        ["IA", "Iowa"],
        ["KS", "Kansas"],
        ["KY", "Kentucky"],
        ["LA", "Louisiana"],
        ["ME", "Maine"],
        ["MD", "Maryland"],
        ["MA", "Massachusetts"],
        ["MI", "Michigan"],
        ["MN", "Minnesota"],
        ["MS", "Mississippi"],
        ["MO", "Missouri"],
        ["MT", "Montana"],
        ["NE", "Nebraska"],
        ["NV", "Nevada"],
        ["NH", "New Hampshire"],
        ["NJ", "New Jersey"],
        ["NM", "New Mexico"],
        ["NY", "New York"],
        ["NC", "North Carolina"],
        ["ND", "North Dakota"],
        ["OH", "Ohio"],
        ["OK", "Oklahoma"],
        ["OR", "Oregon"],
        ["PA", "Pennsylvania"],
        ["RI", "Rhode Island"],
        ["SC", "South Carolina"],
        ["SD", "South Dakota"],
        ["TN", "Tennessee"],
        ["TX", "Texas"],
        ["UT", "Utah"],
        ["VT", "Vermont"],
        ["VA", "Virginia"],
        ["WA", "Washington"],
        ["WV", "West Virginia"],
        ["WI", "Wisconsin"],
        ["WY", "Wyoming"]
    ]);

    // POST a new contact
    const handleSubmit = async (e) => {
        e.preventDefault();

        // DEV.. TEMP FROM AND TO VALUES
        const contact = {
            organization,
            firstName,
            lastName,
            street1,
            street2,
            city,
            state,
            zipcode,
            phone,
            email,
            note
        };

        const response = await fetch('http://localhost:4000/api/contacts', {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        };

        if (response.ok) {
            // reset the form
            [setOrganization,
                setFirstName,
                setLastName,
                setStreet1,
                setStreet2,
                setCity,
                setZipcode,
                setPhone,
                setEmail,
                setNote
            ].forEach((stateSetter) => stateSetter(''));

            // reset errors
            setError(null);
            setEmptyFields([]);

            dispatch({ type: 'CREATE_CONTACT', payload: json });
        };
    };


    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Contact:</h3>
            <label htmlFor="organization">Organization:</label>
            <input type="text"
                name="organization"
                id="organization"
                onChange={(e) => setOrganization(e.target.value)}
                value={organization}
            />

            <h5>Name:</h5>
            <label htmlFor="firstName">First:</label>
            <input
                type="text"
                name="firstName"
                id="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
            />

            <label htmlFor="lastName">Last:</label>
            <input
                type="text"
                name="lastName"
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
            />

            <h5>Address:</h5>
            <label htmlFor="street1">Street 1:</label>
            <input
                type="text"
                name="street1"
                id="street1"
                onChange={(e) => setStreet1(e.target.value)}
                value={street1}
            />

            <label htmlFor="street2">Street 2:</label>
            <input
                type="text"
                name="street2"
                id="street2"
                onChange={(e) => setStreet2(e.target.value)}
                value={street2}
            />

            <label htmlFor="city">City:</label>
            <input
                type="text"
                name="city"
                id="city"
                onChange={(e) => setCity(e.target.value)}
                value={city}
            />

            <label className="inline" htmlFor="state">State:</label>
            <select
                name="state"
                id="state"
                onChange={(e) => setState(states.get(e.target.value))}
            >
                {[...states.entries()].map(([key, value]) => <option key={key}>{value}</option>)}
            </select>

            <label htmlFor="zipcode">Zipcode:</label>
            <input
                type="text"
                name="zipcode"
                id="zipcode"
                onChange={(e) => setZipcode(e.target.value)}
                value={zipcode}
            />

            <label htmlFor="phone">Phone:</label>
            <input
                type="text"
                name="phone"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
            />

            <label htmlFor="email">Email:</label>
            <input
                type="text"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label htmlFor="note">Note:</label>
            <textarea
                name="note"
                id="note"
                cols="30"
                rows="10"
                onChange={(e) => setNote(e.target.value)}
                value={note}
            >
            </textarea>
            <button>Add Contact</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
};

export default ContactForm;