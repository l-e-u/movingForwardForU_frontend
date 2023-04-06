import { useState } from 'react';

const TimeInput = ({ hours, minutes, setTime }) => {
    const [isMilitaryTime, setIsMilitaryTime] = useState(true);

    const meridiem = hours < 12 ? 'am' : 'pm';

    // returns number of select input options for range used
    const numberedOptionsJSX = (start, end) => {
        return () => {
            const jsx = [];

            for (let num = start; num <= end; num++) {
                jsx.push(<option key={num} value={String(num).padStart(2, '0')}>{String(num).padStart(2, '0')}</option>);
            };

            return jsx;
        };
    };

    // for 12hr format it returns options 1 - 12, for 24hr format it returns 0 - 23
    const hourOptionsJSX = numberedOptionsJSX((isMilitaryTime ? 0 : 1), (isMilitaryTime ? 23 : 12));

    // for minutes, it always returns options 0 - 59
    const minuteOptionsJSX = numberedOptionsJSX(0, 59);
    const hoursToDisplay = () => {
        let acutalHours = hours;

        if (!isMilitaryTime) {
            // if the hour is zero, then it's midnight (12)
            acutalHours = (acutalHours % 12 === 0) ? 12 : hours % 12;
        };

        return String(acutalHours).padStart(2, '0');
    };

    const handleOnChange = ({ updatedHours = null, updatedMinutes = null }) => {
        setTime({
            hours: (updatedHours === null ? hours : updatedHours),
            minutes: (updatedMinutes === null ? minutes : updatedMinutes)
        });
    };

    return (
        <div className='d-flex gap-2'>
            <div className='input-group'>
                <span
                    className='input-group-text text-uppercase font-monospace text-action'
                    onClick={() => setIsMilitaryTime(!isMilitaryTime)}
                    style={{ cursor: 'pointer' }}
                >
                    {(isMilitaryTime ? '24' : '12') + 'hr'}
                </span>
                <div className='form-floating'>
                    <select
                        className='form-select'
                        name='hourSelect'
                        id='hourSelect'
                        value={hoursToDisplay()}
                        onChange={e => {
                            const selectedNumber = Number(e.target.value);
                            let actualHour = selectedNumber;

                            // when it's on 12hr format check if the actual hour to be set needs to be adjusted
                            if (!isMilitaryTime) {
                                // only when setting midnight does the hour have to be adjusted.
                                if ((meridiem === 'am') && (selectedNumber === 12)) actualHour = 0;

                                // only 1pm to 11pm needs to be adjusted
                                if ((meridiem === 'pm') && (selectedNumber < 12)) actualHour += 12;
                            };

                            handleOnChange({ updatedHours: actualHour });
                        }} >
                        {hourOptionsJSX()}
                    </select>
                    <label
                        htmlFor='hoursSelect'
                        className='form-label'>
                        Hour
                    </label>
                </div>
            </div>

            <div className='input-group'>
                <div className='form-floating'>
                    <select
                        name='minuteSelect'
                        id='minuteSelect'
                        className='form-select'
                        value={String(minutes).padStart(2, '0')}
                        onChange={e => handleOnChange({ updatedMinutes: Number(e.target.value) })}>
                        {minuteOptionsJSX()}
                    </select>
                    <label htmlFor='minuteSelect' className='form-label'>Minute</label>
                </div>
                {!isMilitaryTime &&
                    <span
                        className='input-group-text text-uppercase font-monospace text-action'
                        onClick={() => {
                            let actualHour = hours;

                            // from am to pm
                            if (meridiem === 'am') actualHour += 12;

                            // from pm to am
                            if (meridiem === 'pm') actualHour -= 12;

                            handleOnChange({ updatedHours: actualHour });
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {meridiem}
                    </span>
                }
            </div>
        </div>
    );
};

export default TimeInput;