import { dateStringFormat_YYYY_MM_DD } from '../utils/StringUtils';

const DateInput = ({ date, setDate, className = '' }) => {
    return (
        <input
            className={className}
            onChange={e => {
                const date = e.target.valueAsDate;

                if (date) {
                    // this helps avoid falling back one day from user input
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                };
                setDate(date);
            }}
            type='date'
            value={date ? dateStringFormat_YYYY_MM_DD(date) : ''}
        />
    );

};

export default DateInput;