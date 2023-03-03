import { useState } from 'react';

const TimeInput = ({ date, setTime }) => {
    const [isMilitaryTime, setIsMilitaryTime] = useState(true);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours < 12 ? 'am' : 'pm';
    const numberedOptionsJSX = (start, end) => {
        return () => {
            const jsx = [];

            for (let num = start; num <= end; num++) {
                jsx.push(<option key={num} value={num}>{num}</option>);
            };

            return jsx;
        };
    };
    const hourOptionsJSX = numberedOptionsJSX((isMilitaryTime ? 0 : 1), (isMilitaryTime ? 23 : 12));
    const minuteOptionsJSX = numberedOptionsJSX(0, 59);
    const hoursToDisplay = () => {
        let value = hours;

        if (!isMilitaryTime) {
            value %= 12;

            // 12hr format uses 12 for midnight
            if (value === 0) return 12;
            if (meridiem === 'pm') return value % 12;
        };

        return value;
    };

    return (
        <div className='d-flex gap-2 mt-2'>
            <div className='input-group'>
                <span
                    className='input-group-text text-uppercase font-monospace'
                    onClick={() => setIsMilitaryTime(!isMilitaryTime)}>
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

                            setTime({ hours: actualHour });
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
                        value={minutes}
                        onChange={e => setTime({ minutes: Number(e.target.value) })}>
                        {minuteOptionsJSX()}
                    </select>
                    <label htmlFor='minuteSelect' className='form-label'>Minute</label>
                </div>
                {!isMilitaryTime &&
                    <span
                        className='input-group-text text-uppercase font-monospace'
                        onClick={() => {
                            let actualHour = hours;

                            // from am to pm
                            if (meridiem === 'am') actualHour += 12;

                            // from pm to am
                            if (meridiem === 'pm') actualHour -= 12;

                            setTime({ hours: actualHour });
                        }}>
                        {meridiem}
                    </span>
                }
            </div>
        </div>
    );
};

export default TimeInput;