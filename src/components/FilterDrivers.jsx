import { useEffect } from 'react';

// components
import Select from 'react-select';

// hooks
import { useUsersContext } from '../hooks/useUsersContext';
import { useGetUsers } from '../hooks/useGetUsers';


const FilterDrivers = ({ selectedDriverFilters, setSelectedDriverFilters }) => {
   const { users } = useUsersContext();
   const { getUsers, error, isLoading } = useGetUsers();

   const options = users.map(user => ({ label: user.fullName, value: user._id }));
   const handleOnChange = (selectedOptions) => setSelectedDriverFilters(selectedOptions.map(option => option.value));
   const value = selectedDriverFilters.map(driverID => options.find(option => driverID === option.value))

   // on first mount only, get documents
   useEffect(() => {
      getUsers();
   }, []);

   return (
      <Select
         className='text-reset'
         classNamePrefix='mySelectInput'
         closeMenuOnSelect={false}
         isDisabled={error || isLoading}
         isLoading={isLoading}
         isMulti={true}
         isSearchable={true}
         isClearable={true}
         options={options}
         onChange={handleOnChange}
         placeholder='Select or Search'
         value={value}
      />
   );
};

export default FilterDrivers;