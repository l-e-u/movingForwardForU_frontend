import { useEffect, useState } from 'react';

const DateInput = ({ saveTheDate }) => {
    const monthNames = [
        { abbr: 'jan', full: 'january' },
        { abbr: 'feb', full: 'february' },
        { abbr: 'mar', full: 'march' },
        { abbr: 'apr', full: 'april' },
        { abbr: 'may', full: 'may' },
        { abbr: 'jun', full: 'june' },
        { abbr: 'jul', full: 'july' },
        { abbr: 'aug', full: 'august' },
        { abbr: 'sep', full: 'september' },
        { abbr: 'oct', full: 'october' },
        { abbr: 'nov', full: 'november' },
        { abbr: 'dec', full: 'december' }
    ];
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        saveTheDate(date)
    }, [date]);

    // go to the first of next month and set date to 0 to have it roll back one day
    const lastDayoftheMonth = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
    const optionsNumbersJSX = (min, max) => {
        const JSX = [];

        for (let number = min; number <= max; number++) {
            JSX.push(
                <option key={number} value={number}>{number}</option>
            );
        };

        return JSX;
    };

    return (
        <div className='d-flex mt-2 gap-2'>
            <div className='form-floating' style={{ flex: '1 1 0' }}>
                <select
                    className='form-select'
                    name='dateSelect'
                    id='dateSelect'
                    min={1}
                    max={lastDayoftheMonth}
                    value={date.getDate()}
                    onChange={(e) => setDate(prev => {
                        const updateDate = new Date(prev);

                        updateDate.setDate(Number(e.target.value));
                        return updateDate;
                    })}>
                    {optionsNumbersJSX(1, lastDayoftheMonth)}
                </select>
                <label htmlFor='dateSelect' className='form-label'>Day</label>
            </div>

            <div className='form-floating' style={{ flex: '1 1 0' }}>
                <select
                    className='form-select text-capitalize'
                    name='monthSelect'
                    id='monthSelect'
                    value={monthNames[date.getMonth()].abbr}
                    onChange={(e) => setDate(prev => {
                        const updateDate = new Date(prev);

                        updateDate.setDate(1);
                        updateDate.setMonth(e.target.selectedIndex);

                        return updateDate;
                    })} >
                    {monthNames.map(month => {
                        const { abbr } = month;
                        return (
                            <option key={abbr} value={abbr} >{abbr}</option>
                        )
                    })
                    }
                </select>
                <label className='form-label' htmlFor='monthSelect'>Month</label>
            </div>

            <div className='form-floating' style={{ flex: '1 1 0' }}>
                <select
                    className='form-select'
                    name='yearSelect'
                    id='yearSelect'
                    min={1990}
                    max={2050}
                    value={date.getFullYear()}
                    onChange={(e) => setDate(prev => {
                        const updateDate = new Date(prev);

                        updateDate.setFullYear(Number(e.target.value));
                        return updateDate;
                    })}>
                    {optionsNumbersJSX(2020, 2037)}
                </select>
                <label htmlFor='yearSelect' className='form-label'>Year</label>
            </div>
        </div>
    );
};

export default DateInput;