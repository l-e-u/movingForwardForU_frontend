const DateInput = ({ date, setDate }) => {
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
    const handleOnChange = ({ day = null, month = null, year = null }) => {
        const newDate = new Date(date);
        if (day !== null) newDate.setDate(day);
        if (month !== null) newDate.setMonth(month);
        if (year !== null) newDate.setFullYear(year);
        setDate({ date: newDate });
    };

    return (
        <div className='d-flex gap-2'>
            <div className='form-floating' style={{ flex: '1 1 0' }}>
                <select
                    className='form-select'
                    name='dateSelect'
                    id='dateSelect'
                    min={1}
                    max={lastDayoftheMonth}
                    value={date.getDate()}
                    onChange={(e) => handleOnChange({ day: e.target.selectedIndex + 1 })}>
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
                    onChange={(e) => handleOnChange({ day: 1, month: e.target.selectedIndex })} >
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
                    onChange={(e) => handleOnChange({ day: (date.getDate() === 29 && date.getMonth() === 1) ? 28 : null, year: Number(e.target.value) })}>
                    {optionsNumbersJSX(2020, 2037)}
                </select>
                <label htmlFor='yearSelect' className='form-label'>Year</label>
            </div>
        </div >
    );
};

export default DateInput;