const AddressInput = (
    {
        id,
        street1,
        street2,
        city,
        state,
        zipcode,
        setStreet1,
        setStreet2,
        setCity,
        setState,
        setZipcode,
        emptyFields
    }) => {

    // uses user input to look up state abbreviation to store
    const statesKeyIsFullNameMap = new Map([
        ['alabama', 'al'],
        ['alaska', 'ak'],
        ['arizona', 'az'],
        ['arkansas', 'ar'],
        ['california', 'ca'],
        ['colorado', 'co'],
        ['connecticut', 'ct'],
        ['delaware', 'de'],
        ['florida', 'fl'],
        ['georgia', 'ga'],
        ['hawaii', 'hi'],
        ['idaho', 'id'],
        ['illinois', 'il'],
        ['indiana', 'in'],
        ['iowa', 'ia'],
        ['kansas', 'ks'],
        ['kentucky', 'ky'],
        ['louisiana', 'la'],
        ['maine', 'me'],
        ['maryland', 'md'],
        ['massachusetts', 'ma'],
        ['michigan', 'mi'],
        ['minnesota', 'mn'],
        ['mississippi', 'ms'],
        ['missouri', 'mo'],
        ['montana', 'mt'],
        ['nebraska', 'ne'],
        ['nevada', 'nv'],
        ['new hampshire', 'nh'],
        ['new jersey', 'nj'],
        ['new mexico', 'nm'],
        ['new york', 'ny'],
        ['north carolina', 'nc'],
        ['north dakota', 'nd'],
        ['ohio', 'oh'],
        ['oklahoma', 'ok'],
        ['oregon', 'or'],
        ['palau', 'pw'],
        ['pennsylvania', 'pa'],
        ['rhode island', 'ri'],
        ['south carolina', 'sc'],
        ['south dakota', 'sd'],
        ['tennessee', 'tn'],
        ['texas', 'tx'],
        ['utah', 'ut'],
        ['vermont', 'vt'],
        ['virginia', 'va'],
        ['washington', 'wa'],
        ['west virginia', 'wv'],
        ['wisconsin', 'wi'],
        ['wyoming', 'wy']
    ]);

    // checks state property and populates value for select element
    const statesKeyIsAbbreviatedMap = new Map([
        ["al", "alabama"],
        ["ak", "alaska"],
        ["az", "arizona"],
        ["ar", "arkansas"],
        ["ca", "california"],
        ["co", "colorado"],
        ["ct", "connecticut"],
        ["de", "delaware"],
        ["dc", "district of columbia"],
        ["fl", "florida"],
        ["ga", "georgia"],
        ["hi", "hawaii"],
        ["id", "idaho"],
        ["il", "illinois"],
        ["in", "indiana"],
        ["ia", "iowa"],
        ["ks", "kansas"],
        ["ky", "kentucky"],
        ["la", "louisiana"],
        ["me", "maine"],
        ["md", "maryland"],
        ["ma", "massachusetts"],
        ["mi", "michigan"],
        ["mn", "minnesota"],
        ["ms", "mississippi"],
        ["mo", "missouri"],
        ["mt", "montana"],
        ["ne", "nebraska"],
        ["nv", "nevada"],
        ["nh", "new hampshire"],
        ["nj", "new jersey"],
        ["nm", "new mexico"],
        ["ny", "new york"],
        ["nc", "north carolina"],
        ["nd", "north dakota"],
        ["oh", "ohio"],
        ["ok", "oklahoma"],
        ["or", "oregon"],
        ["pa", "pennsylvania"],
        ["ri", "rhode island"],
        ["sc", "south carolina"],
        ["sd", "south dakota"],
        ["tn", "tennessee"],
        ["tx", "texas"],
        ["ut", "utah"],
        ["vt", "vermont"],
        ["va", "virginia"],
        ["wa", "washington"],
        ["wv", "west virginia"],
        ["wi", "wisconsin"],
        ["wy", "wyoming"]
    ]);

    return (
        <div>
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
                onChange={(e) => setState(statesKeyIsFullNameMap.get(e.target.value))}
                value={statesKeyIsAbbreviatedMap.get(state) || 'Select...'}
            >
                <option disabled={!!state}>Select...</option>
                {[...statesKeyIsAbbreviatedMap.entries()].map(([key, value]) => <option key={key}>{value}</option>)}
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
        </div>
    );
};

export default AddressInput;