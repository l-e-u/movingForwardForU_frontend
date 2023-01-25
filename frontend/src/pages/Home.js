import { useEffect } from "react";
import { useJobsContext } from "../hooks/useJobsContext.js";

// components
import JobDetails from '../components/JobDetails.js';
import JobForm from '../components/JobForm.js'
// import StatusForm from "../components/StatusForm.js";

const Home = () => {
    const { jobs, dispatch } = useJobsContext();

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('http://localhost:4000/api/jobs');
            const json = await response.json();

            console.log('from server:', json);

            if (response.ok) {
                dispatch({ type: 'SET_JOBS', payload: json });
            };
        };

        fetchJobs();
    }, [dispatch]);


    return (
        <div className='home'>
            <div className='jobs'>
                {jobs && jobs.map((job) => {
                    return <JobDetails key={job._id} job={job} />
                })}
            </div>
            <JobForm />
        </div>
    )
};

export default Home;