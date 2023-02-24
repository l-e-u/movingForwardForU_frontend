// parent must have position set to relative
const CreatedInfo = ({ createdBy, createdAt }) => {
    const date = new Date(createdAt);
    const firstName = createdBy?.firstName.toLowerCase();
    const lastInitial = createdBy?.lastName.charAt(0).toLowerCase();
    const dateCreated = date.toLocaleDateString();
    const timeCreated = String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0');

    return (
        <small className='position-absolute text-end bottom-0 end-0 pe-3 pb-1 fst-italic text-secondary smallPrint w-100'>
            {`created on ${dateCreated} at ${timeCreated}` + (createdBy ? ` by ${firstName} ${lastInitial}` : '') + '.'}
        </small>
    );
};

export default CreatedInfo;