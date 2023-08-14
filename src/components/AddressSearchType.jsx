import Select from 'react-select';

const AddressSearchType = ({ addressIsSet, setType, value }) => {
   const searchTypes = ['contacts', 'google', 'none'];
   const searchOptions = searchTypes.map(type => ({
      label: type,
      value: type
   }));
   const handleOnChange = (selectedOption) => {
      setType(searchOptions.find(option => option.value === selectedOption.value).value);
   };
   const selectStyles = {
      singleValue: base => ({
         ...base,
         color: 'inherit'
      })
   };

   return (
      <Select
         className='text-reset text-capitalize'
         classNamePrefix='mySelectInput'
         defaultValue={searchOptions[0]}
         hideSelectedOptions={false}
         isClearable={false}
         isDisabled={addressIsSet}
         isSearchable={false}
         onChange={handleOnChange}
         options={searchOptions}
         styles={selectStyles}
         value={searchOptions.find(option => option.value === value)}
      />
   )
}

export default AddressSearchType;