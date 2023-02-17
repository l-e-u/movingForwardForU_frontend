const LogHistory = ({ logs }) => {
    if (logs.length === 0) return null;
    return (
        <div>
            <label><small className="text-secondary">Log</small></label>
            <ul>
                {logs.map((log) => {
                    const date = new Date(log.createdAt);
                    return (
                        <li key={log._id}>
                            {`${log.note} by ${log.user.username} at ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default LogHistory;