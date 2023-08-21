import { useState } from 'react';

// hooks
import { useUpdateUser } from '../hooks/useUpdateUser';

// components
import UserForm from './UserForm';

const EditUserForm = ({ currentUser, hideForm }) => {
   const { updateUser, error, isLoading } = useUpdateUser();

   //  get the document id that's being edited
   const { _id } = currentUser;

   const [editedUser, setEditedUser] = useState({ ...currentUser, roles: [...currentUser.roles] });

   // defining form options
   const formHeading = 'Edit User';

   // changes value depending of the form is fetching or not
   const submitButtonText = isLoading ? 'Updating' : 'Update';

   // before submitting, check all the fields and only send the fields that have been updated by the user
   const handleOnSubmit = async (e) => {
      e.preventDefault();

      const updatedFields = {};

      for (const property of Object.keys(editedUser)) {
         const currentValue = currentUser[property];
         const editedValue = editedUser[property];

         if (property === 'roles') {
            if (currentValue.length !== editedValue.length) {
               updatedFields.roles = editedValue;
            };

            for (let index = 0; index < currentValue.length; index++) {
               const role = currentValue[index];

               if (!editedValue.includes(role)) {
                  updatedFields.roles = editedValue;
                  break;
               };
            };
         };

         if (
            (property === 'address') ||
            (property === 'firstName') ||
            (property === 'lastName') ||
            (property === 'phoneNumber') ||
            (property === 'email') ||
            (property === 'note')
         )
            if (currentValue.toString().trim() !== editedValue.toString().trim()) {
               updatedFields[property] = editedValue;
            };
      };

      const wasUpdated = await updateUser({ _id, updatedFields });

      if (wasUpdated) hideForm();
   };

   return (
      <UserForm
         error={error}
         heading={formHeading}
         hideForm={hideForm}
         isFetching={isLoading}
         handleSubmit={handleOnSubmit}
         setUser={setEditedUser}
         showActivation={true}
         submitButtonText={submitButtonText}
         submitButtonIsDisabled={isLoading}
         user={editedUser}
      />
   );
};

export default EditUserForm;