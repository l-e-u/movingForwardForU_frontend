const EditAndDeleteIconButtons = () => {
    return (
        <div className="position-absolute top-0 end-0 pe-3 pt-2 d-flex">
            {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(contact)} />}
            <div className="ps-5">

                <DeleteDocIcon onClick={() => deleteById(_id)} />
            </div>
        </div>
    );
};

export default EditAndDeleteIconButtons;