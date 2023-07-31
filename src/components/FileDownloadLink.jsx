const FileDownloadButton = ({
   contentType,
   filename,
}) => {
   const API_BASE_URL = process.env.API_BASE_URL;
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
      <a
         className='d-block fs-smaller'
         href={`${API_BASE_URL}/api/attachments/download/` + filename}
         rel='noreferrer'
         target='_blank'
      >
         <span>Download</span><i className={'ms-1 bi ' + iconClassText}></i>
      </a>
   );
};

export default FileDownloadButton;