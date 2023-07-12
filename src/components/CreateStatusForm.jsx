import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// hooks
import { useCreateStatus } from '../hooks/useCreateStatus';

// components
import FormHeader from './FormHeader';
import StatusForm from './StatusForm';

// Form to create a status for a job and description of what the status means.
const CreateStatusForm = ({ setShowThisForm }) => {
   const { createStatus, error, isLoading } = useCreateStatus();
   const [status, setStatus] = useState({ name: '', description: '' });

   return (
      <CSSTransition
         appear={true}
         classNames='scale-'
         in={true}
         timeout={500}
      >
         <div className='shadow'>
            <FormHeader text='New Status' handleCloseForm={() => setShowThisForm(false)} />

            <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
               <StatusForm
                  status={status}
                  setStatus={setStatus}
                  error={error}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  handleSubmit={async (e) => {
                     e.preventDefault();

                     await createStatus(status)
                        .then((isCreated) => {
                           if (isCreated) setShowThisForm(false);
                        });
                  }} />
            </div>
         </div>
      </CSSTransition>
   );
};

export default CreateStatusForm;