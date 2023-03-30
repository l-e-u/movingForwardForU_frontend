// when the note has attchments, show button (link) that removes all attachments and set to null, OR when attachments are null, let the user upload multiple images 
const FileUploadHandler = ({ files, isResizingImages, setIsResizingImages, setFiles }) => {
    // resizes an image and returns resolved promise after it's done
    const resizeImage = (originalFile) => {
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
                        resolve({
                            file: new File([blob], filename, { type: filetype }),
                            filename: originalFile.name
                        });
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
    const resizeAllImages = async (files) => {
        return await Promise.all(files.map(file => resizeImage(file)));
    };

    // if there are any existing files, return a button/link to remove all attachments and null the property on the job
    if (files.length > 0) {
        const numOfFiles = files.length;

        return (<button
            className='btn btn-sm text-action border-0 p-0 text-start'
            onClick={() => setFiles({ images: [] })}
            type='button'
        >
            {'Remove ' + (numOfFiles < 2 ? ' attachment.' : numOfFiles + ' attachments.')}
        </button>)
    };

    return (
        <input
            accept='image/png, image/jpeg'
            className='form-control form-control-sm'
            disabled={isResizingImages}
            id='file'
            multiple={true}
            name='file'
            onChange={async (e) => {
                const files = e.target.files;
                setIsResizingImages(true);

                if (files.length > 0) {
                    const images = await resizeAllImages([...files]);
                    setFiles({ images });
                    setIsResizingImages(false);
                }
                else {
                    setIsResizingImages(false);
                }
            }}
            type='file'
        />
    );
};

export default FileUploadHandler;