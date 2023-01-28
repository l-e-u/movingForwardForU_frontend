const AddressInput = (
    {
        id,
        street1,
        street2,
        city,
        zipcode,
        setStreet1,
        setStreet2,
        setCity,
        setState,
        setZipcode,
        emptyFields
    }) => {
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

    return (
        <fieldset>
            <legend>Address</legend>

            <label htmlFor={id + 'Stree1'}>Street 1</label>
            <input
                className={emptyFields.includes('Street1') ? 'error' : ''}
                type="text"
                name={id + 'Street1'}
                id={id + 'Street1'}
                onChange={(e) => { setStreet1(e.target.value) }}
                value={street1}
            />

            <label htmlFor={id + 'Street2'}>Street 2</label>
            <input
                className={emptyFields.includes('Street2') ? 'error' : ''}
                type="text"
                name={id + 'Street2'}
                id={id + 'Street2'}
                onChange={(e) => { setStreet2(e.target.value) }}
                value={street2}
            />

            <label htmlFor={id + 'City'}>City</label>
            <input
                className={emptyFields.includes('City') ? 'error' : ''}
                type="text"
                name={id + 'City'}
                id={id + 'City'}
                onChange={(e) => { setCity(e.target.value) }}
                value={city}
            />

            <label className="inline" htmlFor={id + 'State'}>State</label>
            <select
                name={id + 'State'}
                id={id + 'State'}
                onChange={(e) => setState(states.get(e.target.value))}
            >
                {[...states.entries()].map(([key, value]) => <option key={key}>{value}</option>)}
            </select>

            <label htmlFor={id + 'Zipcode'}>Zipcode</label>
            <input
                className={emptyFields.includes('Zipcode') ? 'error' : ''}
                type="text"
                name={id + 'Zipcode'}
                id={id + 'Zipcode'}
                onChange={(e) => { setZipcode(e.target.value) }}
                value={zipcode}
            />
        </fieldset>
    );
};

export default AddressInput;