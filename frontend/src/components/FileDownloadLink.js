const FileDownloadButton = ({
    contentType,
    filename,
}) => {
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
        <small className='text-action text-end'>
            <a
                className='text-action d-block text-end'
                href={'http://localhost:4000/api/attachments/download/' + filename}
                rel='noreferrer'
                target='_blank'
            >
                <span>Download</span><i className={'ms-1 bi ' + iconClassText}></i>
            </a>
        </small>
    );
};

export default FileDownloadButton;