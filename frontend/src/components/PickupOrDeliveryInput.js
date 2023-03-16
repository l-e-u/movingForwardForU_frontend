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

            <SmallHeader text={propertyText.toUpperCase() + ' DETAILS'} />

            {/* checkboxes for options to set date and set time of pickup/delivery */}
            {/* <div className='d-flex justify-content-around'>
                <div className='form-check'>
                    <input
                        type='checkbox'
                        className='form-check-input'
                        name='dateCheckbox'
                        id='dateCheckbox'
                        checked={date ? true : false}
                        onChange={(e) => {
                            const isChecked = e.target.checked;

                            setPickupOrDeliveryInfo({ date: isChecked ? new Date() : undefined, includeTime: false });
                        }} />
                    <label className='form-check-label' htmlFor='dateCheckbox'><SmallHeader text='Set Date' /></label>
                </div> */}

            <div className='form-check'>
                <input
                    type='checkbox'
                    className='form-check-input'
                    name='timeCheckbox'
                    id='timeCheckbox'
                    checked={includeTime}
                    onChange={e => setPickupOrDeliveryInfo({ includeTime: e.target.checked })}
                />
                <label className='form-check-label' htmlFor='timeCheckbox'><SmallHeader text='Set Time' /></label>
            </div>

            {/* render when pickup/delivery has a date */}
            {date && <DateInput date={new Date(date)} setDate={setPickupOrDeliveryInfo} />}

            {includeTime && <TimeInput date={new Date(date)} setTime={setPickupOrDeliveryInfo} />}

            <PlacesAutocomplete
                value={address}
                onChange={value => setPickupOrDeliveryInfo({ address: value })}
                onSelect={value => setPickupOrDeliveryInfo({ address: value })}
                debounce={250}
                highlightFirstSuggestion={true}
                shouldFetchSuggestions={address.length > 2}>
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
                                    Address
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
                    )
                }
                }
            </PlacesAutocomplete>
        </div>
    );
};

export default PickupOrDeliveryInput;