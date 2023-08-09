// resizes an image and returns resolved promise after it's done
export const resizeImage = (originalFile) => {
   return new Promise(resolve => {
      const filename = originalFile.name;
      const filetype = originalFile.type;
      const reader = new FileReader();

      // define what happens when the reader is loaded
      reader.onload = function (readerEvent) {
         const image = new Image();

         // define when the image is loaded
         image.onload = function () {
            const canvas = document.createElement('canvas');
            const max_size = 800; /* max size */
            let width = image.width;
            let height = image.height;

            if (width > height) {
               if (width > max_size) {
                  height *= max_size / width;
                  width = max_size;
               }
            } else {
               if (height > max_size) {
                  width *= max_size / height;
                  height = max_size;
               }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            canvas.toBlob(function (blob) {
               resolve(new File([blob], filename, { type: filetype }));
            });
         }
         // load the image
         image.src = readerEvent.target.result;
      }
      // load the reader
      reader.readAsDataURL(originalFile);
   });
};

// takes all the images and returns a resolve when all the images are done resizing
export const resizeImages = async (files) => {
   return await Promise.all(files.map(file => resizeImage(file)));
}