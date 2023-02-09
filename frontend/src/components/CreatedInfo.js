// parent must have position set to relative
const CreatedInfo = (props) => {
    const { createdBy, createdAt } = props;
    const date = new Date(createdAt);
    const firstName = createdBy.firstName.toLowerCase();
    const lastInitial = createdBy.lastName.charAt(0).toLowerCase();
    const dateCreated = date.toLocaleDateString();
    const timeCreated = String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0');

    return (
        <small className='fst-italic position-absolute bottom-0 end-0 text-secondary pe-3 pb-2'>
            {`created on ${dateCreated} at ${timeCreated} by ${firstName} ${lastInitial}.`}
        </small>
    );
};

export default CreatedInfo;