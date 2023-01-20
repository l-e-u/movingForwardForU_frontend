import { useState } from "react";

const JobForm = () => {
    const [status, setStatus] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [createdAt, setCreatedAt] = useState(new Date());

    return (
        <form className="create">
            <h3>Add a New Job</h3>

            <label htmlFor="">From:</label>
            <input type="text" name="" id="" />
        </form>
    );
};