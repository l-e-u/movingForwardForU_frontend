const TimeInput = (props) => {
    return (
        <div>
            <label>Time:</label>
            <div className="flexContainer">
                <input type="number"
                    min={0}
                    max={23}
                    value={props.hours}
                    onChange={(e) => props.setHours(e.target.valueAsNumber)}
                />
                <input type="number"
                    min={0}
                    max={59}
                    value={props.minutes}
                    onChange={(e) => props.setMinutes(e.target.valueAsNumber)}
                />
            </div>
        </div>
    );
};

export default TimeInput;