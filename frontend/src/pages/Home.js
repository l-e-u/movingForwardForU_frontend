import { useEffect, useState } from "react";

// components
import JobDetails from '../components/JobDetails.js';

const Home = () => {
    const [jobs, setJobs] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const response = await fetch('http://localhost:4000/api/jobs');
            const json = await response.json();

            if (response.ok) {
                setJobs(json);
            };
        };

        fetchJobs();
    }, []);

    return (
        <div className='home'>
            <div className='jobs'>
                {jobs && jobs.map((job) => {
                    return <JobDetails key={job._id} job={job} />
                })}
            </div>
        </div>
    )
};

export default Home;