import { CSSTransition } from 'react-transition-group';

// components
import ActionButton from './ActionButton';
import FormHeader from './FormHeader';
import XButton from './XButton';

// hooks
import { useCreateArchive } from '../hooks/useCreateArchive';

const ArchiveConfirmation = ({ callBack, job, setShowThisForm }) => {
    const { archiveJob, error, isLoading } = useCreateArchive();

    return (
        <CSSTransition
            appear={true}
            classNames='scale-'
            in={true}
            timeout={500}
        >
            <div className='shadow position-relative rounded background-white text-reset p-4'>
                <div className='position-absolute top-0 end-0 p-2'><XButton handleOnClick={() => setShowThisForm(false)} /></div>

                <h2 className='fs-5'>Archive?</h2>
                <p style={{ whiteSpace: 'pre-wrap' }}>{'This job will be archived and its references to other documents (contact, status, users, and fees) will not be updated.\nThe archive will be treated as a receipt; its contents, and any attachments will be preserved. Only additional text notes may be appended afterwards.'}</p>

                <ActionButton
                    alignX='right'
                    text={(isLoading ? 'Archiving...' : 'Archive')}
                    isLoading={isLoading}
                    handleOnClick={() => {
                        archiveJob(job)
                            .then(isArchived => {
                                if (isArchived) {
                                    setShowThisForm(false);
                                    callBack();
                                };
                            });
                    }}
                />
                {error && <div>{error.message}</div>}
            </div>
        </CSSTransition>
    );
};

export default ArchiveConfirmation;