// components
import Card from './Card';
import ActionButton from './ActionButton';

// hooks
import {useDeleteDocument} from '../hooks/DeleteDocument';

const DeleteConfirmation =({
  _id,
  dispatch,
  model,
  route,
  setShowThisForm
})=>{
  const {deleteDocument, error, isLoading}=useDeleteDocument();
  
  return(
    <Card
    header={<div>Confirm Delete</div>}
    body={<>
    <p>`Are you sure you want to delete this ${model.toLowerCase()}?`</p>
    
    <div className='d-flex justify-content-between'>
    <ActionButton
    text='Cancel'
    handleOnClick={()=>setShowThisForm(false)}
    />
    
    <ActionButton
    text={(isLoading?'Deleting...':'Confirm')}
    handleOnClick={()=>{
      deleteDocument({_id,dispatch,model,route})
      .then(isDeleted=>{
        if(isDeleted)setShowThisForm(false);
      });
    }}
    />
    </div>
    </>}
    />
    );
};

export default DeleteConfirmation;