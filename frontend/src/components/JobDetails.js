import { useJobsContext } from "../hooks/useJobsContext.js";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const JobDetails = ({ job }) => {
    const { dispatch } = useJobsContext();

    const handleClick = async () => {
        const response = await fetch('http://localhost:4000/api/jobs/' + job._id, {
            method: 'DELETE'
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_JOB', payload: json })
        };
    };

    return (
        <div className='job-details'>
            <h4>{job.status}</h4>
            <p><strong>From: </strong> {job.from}</p>
            <p><strong>To: </strong> {job.to}</p>
            <p>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
            <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
        </div>
    )
}

export default JobDetails;