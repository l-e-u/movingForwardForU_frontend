import {useState} from 'react';

// components
import ActionButton from './ActionButton';

// context
import {useAuthContext} from '../context/useAuthContext';

const FileDownloadButton = ({
    contentType,
    files_id,
}) => {
  const {user}=useAuthContext();
  const [error, setError]=useState(null);
  const [isLoading, setIsLoading]=useState(null);
  
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
        <button
            className='btn btn-sm border-0 text-decoration-underline text-action d-flex ms-auto'
            onClick={async()=>{
              setError(false);
              setIsLoading(true);
              
              const response=fetch('/attachments/download/'+files_id)
            }}
            type='button'
        >
            <span>Download</span><i className={'ms-3 bi '+iconClassText}></i>
        </button>
    );

};

export default FileDownloadButton;