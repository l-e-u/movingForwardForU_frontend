import Button from './Button';

const AddDocumentButton = ({ handleClick }) => (
   <Button handleClick={handleClick}>
      <i className='bi bi-plus'></i>
   </Button>
);

export default AddDocumentButton; 