const JobDetails = ({ job }) => {
    return (
        <div className='job-details'>
            <h4>{job.status}</h4>
            <p><strong>From: </strong> {job.pickUp}</p>
            <p><strong>To: </strong> {job.dropOff}</p>
            <p>{job.createdAt}</p>
        </div>
    )
}

export default JobDetails;