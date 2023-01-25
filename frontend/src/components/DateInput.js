const DateInput = (props) => {
    const monthsText = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    // go to the first of next month and set date to 0 to have it roll back one day
    const lastDayoftheMonth = new Date(props.year, (props.month + 1), 0).getDate();

    return (
        <div>
            <label>Date:</label>
            <div className="flexContainer">
                <select
                    name='month'
                    id='month'
                    onChange={(e) => props.setMonth(e.target.selectedIndex)}
                    defaultValue={monthsText[props.month]}
                >
                    {monthsText.map(text => {
                        return (
                            <option key={text} value={text}>{text}</option>
                        )
                    })
                    }
                </select>
                <input type="number"
                    min={1}
                    max={lastDayoftheMonth}
                    value={props.day}
                    onChange={(e) => props.setDate(e.target.valueAsNumber)}
                />
                <input type="number"
                    min={1990}
                    max={2050}
                    value={props.year}
                    onChange={(e) => props.setYear(e.target.valueAsNumber)}
                />
            </div>
        </div>
    );
};

export default DateInput;