import { dateStringFormat, timeStringFormat } from '../utils/StringUtils';

// parent must have position set to relative
const CreatedInfo = ({ createdBy, createdAt }) => {
    const date = new Date(createdAt);
    const firstName = createdBy?.firstName.toLowerCase();
    const lastInitial = createdBy?.lastName.charAt(0).toLowerCase();

    return (
        <small className='fst-italic text-secondary smallPrint'>
            {`created on ${dateStringFormat(date)} at ${timeStringFormat(date)}` + (createdBy ? ` by ${firstName} ${lastInitial}` : '')}
        </small>
    );
    return (
        <small className='position-absolute text-end bottom-0 end-0 pe-3 pb-1 fst-italic text-secondary smallPrint w-100'>
            {`created on ${dateStringFormat(date)} at ${timeStringFormat(date)}` + (createdBy ? ` by ${firstName} ${lastInitial}` : '')}
        </small>
    );
};

export default CreatedInfo;