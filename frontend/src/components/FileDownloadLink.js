import { useState } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

const FileDownloadButton = ({
    contentType,
    files_id,
}) => {
    const { user } = useAuthContext();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    let iconClassText;

    switch (contentType) {
        case 'application/pdf':
            iconClassText = 'bi-filetype-pdf';
            break;

        case 'image/jpeg':
        case 'image/jpg':
            iconClassText = 'bi-filetype-jpg';
            break;

        case 'image/png':
            iconClassText = 'bi-filetype-png';
            break;

        default:
            iconClassText = '';
            break;
    };

    return (
        <a download={true} href={'/api/attachments/download/' + files_id}>
            <span>Download</span><i className={'ms-1 bi ' + iconClassText}></i>
        </a>
    );

};

export default FileDownloadButton;