import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import AutoCompleteSelect from './AutoCompleteSelect';
import CancellableOption from './CancellableOption';
import DateInput from './DateInput';
import PlacesAutocomplete from 'react-places-autocomplete';
import SmallHeader from './SmallHeader';
import TimeInput from './TimeInput';

// will set the address/date/time for either pickup or delivery of a job
const PickupOrDeliveryInput = ({
   isPickup,
   job,
   setJob,
   error = null,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { contacts, dispatch } = useContactsContext();
   const { user } = useAuthContext();

   const [input, setInput] = useState('');
   const [searchGoogle, setSearchGoogle] = useState(false);
   const [isLoading, setIsLoading] = useState(null);
   const [errorLoading, setErrorLoading] = useState(null);

   const propertyText = isPickup ? 'pickup' : 'delivery';
   const details = { ...job[propertyText] };
   // const details = isPickup ? { ...job.pickup } : { ...job.delivery };
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

   // on first mount only, get documents
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setErrorLoading(null);

         const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            headers: {
               'Content-Type': 'application/json',
               'Authentication': `Bearer ${user.token}`
            }
         });

         // expecting all contacts
         const json = await response.json();

         if (!response.ok) {
            console.error(json);
            setErrorLoading(json.error);
            setIsLoading(false);
         };

         if (response.ok) {
            setIsLoading(false);
            setErrorLoading(null);
            dispatch({ type: 'SET_CONTACTS', payload: json });
         };
      })();
   }, [API_BASE_URL, dispatch, user]);

   return (
      <div className='d-flex flex-column gap-2' >

         <SmallHeader text={propertyText + ' Details'} />

         <DateInput
            className='form-control form-control-sm'
            date={new Date(date)}
            setDate={input => {
               let updatedDate = input;

               // a job has to have a date
               if (!input) {
                  updatedDate = new Date();
                  // this helps avoid falling back one day from user input
                  updatedDate.setMinutes(updatedDate.getMinutes() + updatedDate.getTimezoneOffset());
               };

               if (includeTime) {
                  updatedDate.setHours(new Date(date).getHours());
                  updatedDate.setMinutes(new Date(date).getMinutes());
               };

               setPickupOrDeliveryInfo({ date: updatedDate });
            }}
         />

         {/* toggle to include a due time */}
         <div className='form-check form-switch'>
            <input
               className='form-check-input'
               id={propertyText + 'ToggleTime'}
               name={propertyText + 'ToggleTime'}
               onChange={e => {
                  const updatedDateTime = new Date(date);
                  updatedDateTime.setHours(new Date().getHours());
                  updatedDateTime.setMinutes(new Date().getMinutes());

                  setPickupOrDeliveryInfo({ includeTime: e.target.checked, date: updatedDateTime });
               }}
               type='checkbox'
               checked={includeTime}
            />
            <label
               className='form-check-label'
               htmlFor={propertyText + 'ToggleTime'}>{(includeTime ? 'Has' : 'No') + ' Due Time'}</label>
         </div >

         {includeTime && <>
            <CSSTransition
               appear={true}
               classNames='fade-'
               in={true}
               timeout={500}
            >
               <TimeInput
                  hours={new Date(date).getHours()}
                  minutes={new Date(date).getMinutes()}
                  setTime={({ hours, minutes }) => {
                     const updatedDateTime = new Date(date);

                     updatedDateTime.setHours(hours);
                     updatedDateTime.setMinutes(minutes);
                     updatedDateTime.setSeconds(0);
                     updatedDateTime.setMilliseconds(0);

                     setPickupOrDeliveryInfo({ date: updatedDateTime });
                  }}
               />
            </CSSTransition>
         </>
         }

         {/* toggle between selecting contact's address or a google address search */}
         <div className='form-check form-switch'>
            <input
               className='form-check-input'
               id={propertyText + 'ToggleAddress'}
               onChange={() => {
                  setSearchGoogle(prev => !prev);
                  setInput('');
               }}
               type='checkbox'
               checked={searchGoogle}
            />
            <label
               className='form-check-label'
               htmlFor={propertyText + 'Toggle'}>{(searchGoogle ? 'Google' : 'Contacts') + ' Address Search'}</label>
         </div >

         {/* when an address is set, show a cancellable option to clear the address */}
         {address &&
            <CancellableOption
               label='Address'
               handleCancelOnClick={() => {
                  setPickupOrDeliveryInfo({ address: '' });
                  setInput('');
               }}
               value={address}
            />
         }

         {/* CONTACT ADDRESS SEARCH */}
         {(!address && !searchGoogle) &&
            <AutoCompleteSelect
               labelText='Address'
               isRequired={true}
               setJob={setJob}
               getListedItemText={value => value.organization}
               filterSuggestions={(contactDoc, text) => contactDoc.organization.toLowerCase().includes(text)}
               inputError={error}
               inputErrorMessage={error?.message}
               documents={contacts ?? []}
               errorLoading={errorLoading}
               isLoading={isLoading}
               handleOnClickListItem={doc => {
                  return () => setPickupOrDeliveryInfo({ address: doc.address });
               }}
            />
         }

         {/* GOOGLE ADDRESS SEARCH */}
         {(!address && searchGoogle) &&
            <PlacesAutocomplete
               debounce={250}
               googleCallbackName={'init' + propertyText.toUpperCase()}
               highlightFirstSuggestion={true}
               onChange={value => setInput(value)}
               onSelect={value => {
                  setPickupOrDeliveryInfo({ address: value });
                  setInput('');
               }}
               shouldFetchSuggestions={input.length > 2}
               value={input}
            >
               {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                  return (
                     <div className='position-relative'>
                        <div className='form-floating'>
                           <input
                              {...getInputProps({
                                 type: 'text',
                                 name: propertyText + 'GoogleAddressAutocomplete',
                                 id: propertyText + 'AddressInput',
                                 placeholder: 'Google...',
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
         }
      </div >
   );
};

export default PickupOrDeliveryInput;