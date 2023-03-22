import { useEffect, useState } from 'react';

// components
import ActionButton from './ActionButton';
import LoadingDocuments from './LoadingDocuments';

// hooks
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { useAuthContext } from '../hooks/useAuthContext';
import FormHeader from './FormHeader';

// jobs and archives can be deleted without checking for any references. any other model document needs to check if there's any existing jobs that have a reference to that document, otherwise the user will have to change those references or delete that job before they can delete the requested document
const DeleteConfirmation = ({
  dispatch,
  doc_id,
  model,
  route,
  setShowThisForm,
  checkReference = false,
}) => {
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

        const response = await fetch(`/api/jobs/filter/${checkReference}/${doc_id}`, {
          headers: {
            'Content-Type': 'application/json',
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
          setReferences(json);
        };
      })();
    }
  }, []);

  return (
    <div className='shadow'>
      <FormHeader text='Confirm Delete' handleCloseForm={() => setShowThisForm(false)} />

      <div className='rounded-bottom background-white text-reset px-3 pb-3 pt-1'>
        {/* show spinner with actively fetching data */}
        {getIsLoading && <div className='my-5'><LoadingDocuments /></div>}

        {error?.server && <p>{'Could not delete. ' + error.server.message + ' Refresh and try again.'}</p>}

        {(references.length > 0) &&
          <p className='m-0 px-3 pt-3 pb-2'>{`This ${model.toLowerCase()} is referenced on one or more jobs, you must delete, archive, or update the job(s) before deleting this document.`}</p>
        }

        {(!error && !getIsLoading && !getError && (references.length === 0)) && <>
          <p style={{ whiteSpace: 'pre-wrap' }}>{`Are you sure you want to delete this ${model.toLowerCase()}?\nThis cannot be undone.`}</p>

          <div className='d-flex flex-column gap-3 flex-sm-row justify-content-between align-items-center'>
            <ActionButton
              text='Cancel'
              handleOnClick={() => setShowThisForm(false)}
            />

            <ActionButton
              text={(isLoading ? 'Deleting...' : 'Confirm')}
              handleOnClick={() => {
                deleteDocument({ _id: doc_id, dispatch, model, route })
                  .then(isDeleted => {
                    if (isDeleted) setShowThisForm(false);
                  });
              }}
            />
          </div>
        </>}
      </div>
    </div>
  );
};

export default DeleteConfirmation;