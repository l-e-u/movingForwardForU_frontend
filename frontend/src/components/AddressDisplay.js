// functions
import { dateStringFormat, timeStringFormat } from '../utils/StringUtils';

import SmallHeader from './SmallHeader';

const AddressDisplay = ({
    address,
    date,
    includeTime,
    heading,
    alignEnd = false
}) => {
    const today = new Date();
    const scheduledDate = new Date(date);
    const militaryTimeString = includeTime ? timeStringFormat(scheduledDate, true) : null;
    const timeString = includeTime ? timeStringFormat(scheduledDate, false) : null;
    let dateString = dateStringFormat(scheduledDate).toUpperCase();

    if (
        (today.getFullYear() === scheduledDate.getFullYear()) &&
        (today.getMonth() === scheduledDate.getMonth()) &&
        (today.getDate() === scheduledDate.getDate())
    ) {
        dateString = 'Today';
    }

    return (
        <div className={(alignEnd ? 'text-end' : '')}>
            <SmallHeader text={heading} />
            <div className='d-flex align-items-center gap-2'>
                <i className={'text-green bi bi-calendar-event order-' + (alignEnd ? '1' : '0')}></i>
                <span className={'flex-grow-1 order-' + (alignEnd ? '0' : '1')}>{dateString}</span>
            </div>
            {includeTime &&
                <div className='d-flex align-items-center gap-2'>
                    <i className={'text-green bi bi-clock order-' + (alignEnd ? '1' : '0')}></i>
                    <div className={'flex-grow-1 order-' + (alignEnd ? '0' : '1')}>
                        {/* <span className='me-3'>{militaryTimeString}</span> */}
                        <span>{timeString}</span>
                    </div>
                </div>}
            {address}
        </div>
    );
};

export default AddressDisplay;