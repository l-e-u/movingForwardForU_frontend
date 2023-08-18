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
   const subHeading = 'New users have to verify their email and set a password before they can login.';
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
         subHeading={subHeading}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
         user={user}
      />
   );
};

export default CreateUserForm;