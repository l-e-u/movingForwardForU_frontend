import React from 'react'

const AttachmentDownloadLink = ({ attachment }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const hasNewFile = !!attachment.file;
   let fileNameText = attachment.originalname?.split('.')[0];

   if (hasNewFile) fileNameText = attachment.filename.split('.')[0];

   return (
      <a
         className='word-break-all text-reset text-decoration-none'
         href={`${API_BASE_URL}/api/attachments/download/` + attachment.filename}
         referrerPolicy='no-referrer'
         rel='nofollow noopener'
         target='_blank'
      >
         {fileNameText}
         <i className='bi bi-download text-secondary ms-2'></i>
      </a>
   );
};

export default AttachmentDownloadLink;