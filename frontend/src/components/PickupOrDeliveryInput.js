import PlacesAutocomplete from 'react-places-autocomplete';

const PickupOrDeliveryInput = ({
    isPickup,
    isRequired,
    address,
    setAddress,
    error = null,
}) => {
    const action = isPickup ? 'pickup' : 'delivery';

    return (
        <fieldset
            className='outline'
            style={{ margin: '0 -0.75rem', padding: '0.5rem 0.75rem' }} >
            <legend className='fs-6 text-capitalize'>{action}</legend>
            <PlacesAutocomplete
                value={address}
                onChange={value => setAddress(value)}
                onSelect={value => setAddress(value)}
                debounce={250}
                highlightFirstSuggestion={true}
                shouldFetchSuggestions={address.length > 2}>
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                    return (
                        <div className="position-relative mb-2">
                            <div className='form-floating'>
                                <input
                                    {...getInputProps({
                                        type: 'text',
                                        name: action + 'GoogleAddressAutocomplete',
                                        id: action + 'AddressInput',
                                        placeholder: 'Search...',
                                        className: 'form-control' + (error ? ' is-invalid' : '')
                                    })}
                                />
                                <label htmlFor={action + 'GoogleAddressAutocomplete'} className={'form-label' + (isRequired ? ' required' : '')}>
                                    Address
                                    {error && <span className='inputError'>{error.message}</span>}
                                </label>
                            </div>
                            <ul className='list-group shadow selectList'>
                                {loading && <li className='list-group-item'>Loading...</li>}
                                {console.log(suggestions)}
                                {suggestions.map(suggestion => {
                                    return (
                                        <li key={suggestion.placeId} className='list-group-item' {...getSuggestionItemProps(suggestion)}>
                                            {suggestion.description}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                }
                }
            </PlacesAutocomplete>
        </fieldset>
    );
};

export default PickupOrDeliveryInput;