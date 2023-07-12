import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

// components
import ActionButton from './ActionButton';
import LoadingDocuments from './LoadingDocuments';
import XButton from './XButton';

// hooks
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { useAuthContext } from '../hooks/useAuthContext';

// jobs and archives can be deleted without checking for any references. any other model document needs to check if there's any existing jobs that have a reference to that document, otherwise the user will have to change those references or delete that job before they can delete the requested document
const DeleteConfirmation = ({
   dispatch,
   doc_id,
   message,
   model,
   route,
   setShowThisForm,
   callBack = () => { },
   checkReference = false,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { deleteDocument, error, isLoading } = useDeleteDocument();

   const [getError, setGetError] = useState(null);
   const [getIsLoading, setGetIsLoading] = useState(null);
   const [references, setReferences] = useState([]);

   // 'checkReference' value is a property on the job model that is a mongoose object id. fetch will return an array of filtered jobs based on the doc_id
   useEffect(() => {
      if (checkReference) {
         (async () => {
            setGetIsLoading(true);
            setGetError(null);

            const response = await fetch(`${API_BASE_URL}/api/jobs?${checkReference}=${doc_id}`, {
               headers: {
                  'Authentication': `Bearer ${user.token}`
               }
            });

            // expecting filtered list of jobs
            const json = await response.json();

            if (!response.ok) {
               console.error(json);
               setGetError(json.error);
               setGetIsLoading(false);
            };

            if (response.ok) {
               setGetError(null);
               setGetIsLoading(false);
               setReferences(json.results);
            };
         })();
      }
   }, [API_BASE_URL, checkReference, doc_id, user]);

   return (
      <CSSTransition
         appear={true}
         classNames='scale-'
         in={true}
         timeout={500}
      >
         <div className='shadow position-relative rounded background-white text-reset p-4'>
            <div className='position-absolute top-0 end-0 p-2'><XButton handleOnClick={() => setShowThisForm(false)} /></div>
            {/* show spinner with actively fetching data */}
            {getIsLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error?.server && <p>{'Could not delete. ' + error.server.message + ' Refresh and try again.'}</p>}

            {(references.length > 0) &&
               <p className='m-0 px-3 pt-3 pb-2'>{`This ${model.toLowerCase()} is referenced on one or more jobs, you must delete, archive, or update the job(s) in order to delete this document.`}</p>
            }

            {(!error && !getIsLoading && !getError && (references.length === 0)) && <>
               <h2 className='fs-5'>Delete?</h2>
               <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>

               <ActionButton
                  alignX='right'
                  handleOnClick={() => {
                     deleteDocument({ _id: doc_id, dispatch, model, route })
                        .then(isDeleted => {
                           if (isDeleted) {
                              setShowThisForm(false);
                              callBack();
                           };
                        });
                  }}
                  text={(isLoading ? 'Deleting...' : 'Delete')}
               />
            </>}
         </div>
      </CSSTransition>
   );
};

export default DeleteConfirmation;