// components
import ActionButton from './ActionButton';

const FileDownloadButton = ({
    contentType,
    files_id,
}) => {
    let iconClassText;

    switch (contentType) {
        case 'application/pdf':
            iconClassText = 'bi-filetype-pdf';
            break;

        case 'image/jpeg':
        case 'image/jpg':
            iconClassText = 'bi-filetype-jpeg';

            break;

        default:
            break;
    };

    return (
        <button
            className='btn btn-sm border-0 text-action d-flex ms-auto'
            type='button'
        >
            <span>Download</span>
        </button>
    );

};

export default FileDownloadButton;