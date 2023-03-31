// components
import { useCreateArchive } from '../hooks/useCreateArchive';
import ActionButton from './ActionButton';
import FormHeader from './FormHeader';

const ArchiveConfirmation = ({ job, setShowThisForm }) => {
    const { archiveJob, error, isLoading } = useCreateArchive();

    return (<div className='shadow rounded background-white'>
        <FormHeader text='Confirm Archive' />
        <div className='p-4'>
            <p style={{ whiteSpace: 'pre-wrap' }}>{'This job will be archived and its references to other documents (contact, status, users, and fees) will not be updated.\nThe archive will be treated as a receipt; its contents, and any attachments will be preserved. Only additional text notes may be appended afterwards.'}</p>

            <div className='d-flex flex-column gap-3 flex-sm-row justify-content-between align-items-center mt-4'>
                <ActionButton
                    text='Cancel'
                    handleOnClick={() => setShowThisForm(false)}
                />

                <ActionButton
                    text={(isLoading ? 'Archiving...' : 'Confirm')}
                    isLoading={isLoading}
                    handleOnClick={() => {
                        archiveJob(job)
                            .then(isArchived => {
                                if (isArchived) setShowThisForm(false);
                            });
                    }}
                />
            </div>
        </div>
    </div>);
};

export default ArchiveConfirmation;