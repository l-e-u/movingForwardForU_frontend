// components
import RequiredFieldsText from './RequiredFieldsText';
import GrowingTextArea from './GrowingTextArea';
import ActionButton from './ActionButton'

// utilities
import { removeExtraSpaces } from '../utils/StringUtils';

const StatusForm = ({ status, setStatus, handleSubmit, error, isDisabled, isLoading }) => {
   const { name, description } = status;

   // error identification
   const errorFromNameInput = error?.path?.toLowerCase() === 'name';
   const errorFromDescriptionInput = error?.path?.toLowerCase() == 'description';

   return (
      <form onSubmit={handleSubmit}>
         <RequiredFieldsText />

         <div className='form-floating mb-3'>
            <input
               type='text'
               className={'form-control' + (errorFromNameInput ? ' is-invalid' : '')}
               name='name'
               placeholder='Name'
               id='name'
               onChange={(e) => {
                  setStatus(prev => {
                     return {
                        ...prev,
                        name: removeExtraSpaces(e.target.value)
                     }
                  })
               }}
               onBlur={(e) => {
                  setStatus(prev => {
                     return {
                        ...prev,
                        name: e.target.value.trim()
                     }
                  })
               }}
               value={name} />
            <label htmlFor='name' className='form-label required'>
               {errorFromNameInput ? <span className='ms-1 text-danger'>{error.message}</span> : 'Name'}
            </label>
         </div>

         <div className='form-floating mb-3'>
            <GrowingTextArea
               className={'form-control' + (errorFromDescriptionInput ? ' is-invalid' : '')}
               name='description'
               onBlur={(e) => {
                  setStatus(prev => {
                     return {
                        ...prev,
                        description: e.target.value.trim()
                     }
                  })
               }}
               onChange={(e) => {
                  setStatus(prev => {
                     return {
                        ...prev,
                        description: e.target.value
                     }
                  })
               }}
               placeholder='Description'
               value={description}
            />
            <label htmlFor='description' className='form-label required'>
               {errorFromDescriptionInput ? <span className='ms-1 text-danger'>{error.message}</span> : 'Description'}
            </label>
         </div>

         <ActionButton
            alignX='right'
            text={(isLoading ? 'Saving...' : 'Save')}
            type='submit'
            isDisabled={isDisabled}
         />
      </form>
   );
};

export default StatusForm;