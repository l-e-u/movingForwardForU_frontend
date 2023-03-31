import PlacesAutocomplete from 'react-places-autocomplete';

// components
import DateInput from './DateInput';
import SmallHeader from './SmallHeader';
import TimeInput from './TimeInput';

// will set the address/date/time for either pickup or delivery of a job
const PickupOrDeliveryInput = ({
    isPickup,
    job,
    setJob,
    error = null,
}) => {
    const propertyText = isPickup ? 'pickup' : 'delivery';
    const details = isPickup ? { ...job.pickup } : { ...job.delivery };
    const { address, date, includeTime } = details;

    // pass in an object, and spreads it in pickup or delivery
    const setPickupOrDeliveryInfo = (info) => {
        setJob(prev => {
            return {
                ...prev,
                [propertyText]: {
                    ...prev[propertyText],
                    ...info
                }
            };
        });
    };

    return (
        <div className='d-flex flex-column gap-2' >

            <SmallHeader text={propertyText + ' Details'} />

            {/* toggle to include a due time */}
            <div className='form-check'>
                <input
                    type='checkbox'
                    className='form-check-input'
                    name={propertyText + 'TimeCheckbox'}
                    id={propertyText + 'TimeCheckbox'}
                    checked={includeTime}
                    onChange={e => setPickupOrDeliveryInfo({ includeTime: e.target.checked })}
                />
                <label className='form-check-label' htmlFor='timeCheckbox'><SmallHeader text='Set Time' /></label>
            </div>

            <DateInput date={new Date(date)} setDate={setPickupOrDeliveryInfo} />

            {includeTime && <TimeInput date={new Date(date)} setTime={setPickupOrDeliveryInfo} />}

            <PlacesAutocomplete
                debounce={250}
                googleCallbackName={'init' + propertyText.toUpperCase()}
                highlightFirstSuggestion={true}
                onChange={value => setPickupOrDeliveryInfo({ address: value })}
                onSelect={value => setPickupOrDeliveryInfo({ address: value })}
                shouldFetchSuggestions={address.length > 2}
                value={address}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                    return (
                        <div className="position-relative">
                            <div className='form-floating'>
                                <input
                                    {...getInputProps({
                                        type: 'text',
                                        name: propertyText + 'GoogleAddressAutocomplete',
                                        id: propertyText + 'AddressInput',
                                        placeholder: 'Search...',
                                        className: 'form-control' + (error ? ' is-invalid' : '')
                                    })}
                                />
                                <label htmlFor={propertyText + 'GoogleAddressAutocomplete'} className='form-label required'>
                                    <i className='bi bi-search text-action me-1'></i> Address
                                    {loading && <span className='ms-2'>: Loading...</span>}
                                    {error && <span className='inputError'>{error.message}</span>}
                                </label>
                            </div>
                            <ul className='list-group shadow selectList'>
                                {suggestions.map(suggestion => {
                                    return (
                                        <li key={suggestion.placeId} className='list-group-item' {...getSuggestionItemProps(suggestion)}>
                                            {suggestion.description}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    );
                }}
            </PlacesAutocomplete>
        </div>
    );
};

export default PickupOrDeliveryInput;