import { resizeImages } from '../utils/FileUtils';

const FileInput = ({ isResizingImages, setIsResizingImagesFalse, setIsResizingImagesTrue, setAttachments }) => {
   const acceptedFileTypes = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'];
   const fileInputClasses = 'myFileInput rounded p-1 w-100 text-reset fs-smaller';
   const fileInputStyles = { border: '1px solid var(--bs-gray-400)' }

   const handleOnChange = async (e) => {
      const { files } = e.target;

      setIsResizingImagesTrue();

      // return early if no files
      if (files.length < 1) return;

      const imageFiles = [];
      const pdfFiles = [];

      for (let index = 0; index < files.length; index++) {
         const file = files[index];
         const { type } = file;

         if (!acceptedFileTypes.includes(type)) continue;
         if (type === 'application/pdf') {
            pdfFiles.push(file);
            continue;
         };

         imageFiles.push(file);
      };

      const resizedImageFiles = await resizeImages(imageFiles);
      const attachments = [...resizedImageFiles, ...pdfFiles];

      setIsResizingImagesFalse();

      // place the whole attachment into its own property, and add a filename that will be used to compare on the server
      setAttachments(attachments.map(attachment => ({ file: attachment, filename: attachment.name })));
   };

   return (
      <input
         accept={acceptedFileTypes.join(',')}
         className={fileInputClasses}
         disabled={isResizingImages}
         id='myFileInput'
         multiple={true}
         onChange={handleOnChange}
         style={fileInputStyles}
         type='file'
      />
   )
}

export default FileInput