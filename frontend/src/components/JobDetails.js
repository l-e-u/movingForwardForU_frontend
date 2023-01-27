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
            <h4>{job.status.name}</h4>
            <h5>{job.customer.organization}</h5>
            <p><strong>From: </strong> {job.from.street1}</p>
            <p><strong>To: </strong> {job.to.street1}</p>
            <p>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
            <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
        </div>
    )
}

export default JobDetails;