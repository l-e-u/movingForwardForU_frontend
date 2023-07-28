// components
import RequiredFieldsText from './RequiredFieldsText';
import GrowingTextArea from './GrowingTextArea';
import ActionButton from './ActionButton'

// utilities
import { removeExtraSpaces } from '../utils/StringUtils';
import FormHeader from './FormHeader';
import SmallHeader from './SmallHeader';
import TextInput from './TextInput';
import SubmitButton from './SubmitButton';

const StatusForm = ({ status, setStatus, handleSubmit, error, isDisabled, isLoading }) => {
   const { name, description } = status;

   // error identification
   const errorFromNameInput = error?.path?.toLowerCase() === 'name';
   const errorFromDescriptionInput = error?.path?.toLowerCase() == 'description';

   // styles for the form
   const formClasses = 'newJob position-relative p-4 text-reset shadow bg-white rounded-4';
   const formStyles = { width: '90vw', maxWidth: '500px' };

   return (
      <form className={formClasses} onSubmit={handleSubmit} style={formStyles}>

         <FormHeader text='New Status' />
         <p className='text-secondary fs-smaller mb-4'>A status categorizes the state of a job.</p>

         <div className='container-fluid p-0'>

            {/* NAME */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Name' />
               </div>
               <div className='col-sm-9'>
                  <TextInput input={status.name} setInput={input => setStatus(prev => ({ ...prev, name: input }))} />
               </div>
            </div>

            {/* DESCRIPTION */}
            <div className='row mb-3'>
               <div className='col-sm-3 d-flex justify-content-start justify-content-sm-end align-items-center'>
                  <SmallHeader text='Description' />
               </div>
               <div className='col-sm-9'>
                  <GrowingTextArea input={status.description} setInput={input => setStatus(prev => ({ ...prev, description: input }))} />
               </div>
            </div>
         </div>

         <SubmitButton
            defaultText='Save'
            loadingText='Saving'
            isDisabled={isLoading}
            isLoading={isLoading}
         />
      </form >
   );
};

export default StatusForm;