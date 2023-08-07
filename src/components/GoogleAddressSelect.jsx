import { useState } from 'react';
import { motion } from 'framer-motion';

// components
import PlacesAutocomplete from 'react-places-autocomplete';

const GoogleAddressSelect = ({ setAddress }) => {
   const [input, setInput] = useState('');

   const inputVariants = {
      mount: {
         border: '1px solid var(--bs-gray-400)',
         outline: '2px solid transparent'
      },
      onFocus: {
         outline: '2px solid var(--mainPalette6)',
      }
   };

   return (
      <PlacesAutocomplete
         debounce={250}
         googleCallbackName='init'
         highlightFirstSuggestion={true}
         onChange={value => setInput(value)}
         onSelect={value => {
            setInput(value);
            setAddress(value);
         }}
         shouldFetchSuggestions={input.length >= 2}
         value={input}
      >
         {google => {
            const {
               getInputProps,
               getSuggestionItemProps,
               suggestions,
               loading: isLoading,
            } = google;
            const hasSuggestions = suggestions.length > 0;

            return (
               <div className='position-relative'>
                  <motion.input
                     {...getInputProps({
                        placeholder: 'Required',
                        className: 'myTextInput location-search-input w-100 rounded-1 text-reset p-2',
                        variants: inputVariants,
                        initial: 'mount',
                        whileFocus: 'onFocus'
                     })}
                  />
                  <div
                     className={`autocomplete-dropdown-container bg-white rounded cursor-pointer position-absolute start-0 w-100${hasSuggestions ? ' shadow py-1' : ''}`}
                     style={{
                        outline: hasSuggestions ? '1px solid var(--bs-gray-300)' : 'none',
                        top: 'calc(100% + 0.5rem)',
                        zIndex: 1000
                     }}
                  >
                     {isLoading && <div className='w-100 text-center p-2 border rounded shadow'>Loading...</div>}
                     {
                        suggestions.map(suggestion => (
                           <div
                              {...getSuggestionItemProps(suggestion, {
                                 className: `px-3 py-2 ${suggestion.active ? 'suggestion-item--active' : 'suggestion-item'}`,
                                 style: { backgroundColor: suggestion.active ? 'var(--mainPalette8)' : 'transparent' }
                              })}
                              key={suggestion.placeId}
                           >
                              <span>{suggestion.description}</span>
                           </div>
                        ))
                     }
                  </div>
               </div>
            )
         }}

      </PlacesAutocomplete>
   )
};

export default GoogleAddressSelect;