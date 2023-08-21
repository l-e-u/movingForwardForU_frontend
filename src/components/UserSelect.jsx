import { useEffect } from 'react'
import Select from 'react-select';

// hooks
import { useGetUsers } from '../hooks/useGetUsers';
import { useUsersContext } from '../hooks/useUsersContext';

// components
import ErrorAlert from './ErrorAlert';

const UserSelect = ({ drivers, placeholder, setUser }) => {
   const { getUsers, error, isLoading } = useGetUsers();
   const { users } = useUsersContext();

   // only list users that are active and have verified their email
   // label is what is listed on the options
   const selectOptions = users
      .filter(user => user.isActive && user.isVerified)
      .map(user => {
         return {
            label: user.fullName,
            value: user._id
         }
      });

   // populate all the drivers already selected
   const valueSelections = selectOptions.filter(option => drivers.find(driver => driver._id === option.value));

   // user can selected multiple drivers, clearing returns an array
   const handleOnChange = (selectedOptions) => {
      const selectedDrivers = selectedOptions.map(option => {
         return users.find(user => option.value === user._id);
      });

      setUser(selectedDrivers);
   };

   // only on initial mount, fetch users
   useEffect(() => {
      getUsers();
   }, []);

   if (error) {
      return <ErrorAlert message={error.message} />;
   };

   return (
      <Select
         classNamePrefix='mySelectInput'
         closeMenuOnSelect={true}
         hideSelectedOptions={true}
         isDisabled={isLoading}
         isLoading={isLoading}
         isClearable
         isSearchable
         isMulti
         loadingMessage={() => 'Loading...'}
         noOptionsMessage={() => 'No results.'}
         placeholder={placeholder || ''}
         options={selectOptions}
         onChange={handleOnChange}
         value={valueSelections}
      />
   )
};

export default UserSelect;