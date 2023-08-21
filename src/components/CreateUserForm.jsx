import { useState } from 'react';

// hooks
import { useRegisterUser } from '../hooks/useRegisterUser';

// components
import UserForm from './UserForm';

const CreateUserForm = ({ hideForm }) => {
   const { registerUser, error, isLoading } = useRegisterUser();

   const [user, setUser] = useState({
      address: '',
      firstName: '',
      email: '',
      isAdmin: false,
      lastName: '',
      phoneNumber: '',
      note: '',
      roles: [],
   });

   const formHeading = 'Register User';
   const submitButtonText = isLoading ? 'Registering' : 'Register';

   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const userRegistered = await registerUser(user);

      if (userRegistered) hideForm();
   };

   return (
      <UserForm
         error={error}
         handleSubmit={handleOnSubmit}
         heading={formHeading}
         hideForm={hideForm}
         isDisabled={isLoading}
         isFetching={isLoading}
         isLoading={isLoading}
         setUser={setUser}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
         user={user}
      />
   );
};

export default CreateUserForm;