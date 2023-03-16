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
    // const militaryTimeString = includeTime ? timeStringFormat(scheduledDate, true) : null;
    const timeString = includeTime ? timeStringFormat(scheduledDate, false) : '-- : --';
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

            {/* date */}
            <div className='d-flex align-items-center gap-2'>
                <i className={'text-action bi bi-calendar-event order-' + (alignEnd ? '1' : '0')}></i>
                <span className={'flex-grow-1 order-' + (alignEnd ? '0' : '1')}>{dateString}</span>
            </div>

            {/* time */}
            <div className='d-flex align-items-center gap-2'>
                <i className={'text-action bi bi-clock order-' + (alignEnd ? '1' : '0')}></i>
                <div className={'flex-grow-1 order-' + (alignEnd ? '0' : '1')}>
                    {/* <span className='me-3'>{militaryTimeString}</span> */}
                    <span>{timeString}</span>
                </div>
            </div>

            {/* address */}
            <div className='d-flex align-items-center gap-2'>
                <i className={'text-action bi bi-geo-alt order-' + (alignEnd ? '1' : '0')}></i>
                <div className={'flex-grow-1 order-' + (alignEnd ? '0' : '1')}>
                    {/* <span className='me-3'>{militaryTimeString}</span> */}
                    <span>{address}</span>
                </div>
            </div>
        </div>
    );
};

export default AddressDisplay;