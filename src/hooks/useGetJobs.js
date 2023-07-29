import {useState} from 'react';

// utilities
import {urlQueryString} from '../utils/StringUtils.js';

const useGetJobs =()=>{
const [error, setError]=useState(null);
const [isLoading,setIsLoading]=useState(false);

const getJobs=(filter)=>{
    setIsLoading(true);
    setError(null);
    
    const filterQuery=urlQueryString(filter);
    
const response = await fetch(`${API_BASE_URL}/api/jobs?page=${currentPage}&limit=${limit}${filterQuery}`, {
            headers: {
               'Authentication': `Bearer ${user.token}`
            }
         });

         // expecting the list of jobs depending on page and limit
         const json = await response.json();

         if (!response.ok) {
            setError(json.error);
            setIsLoading(false);
         };

         if (response.ok) {
             const{count,totalPages,results}=json;
            
            setError(null);
            setIsLoading(false);
            
 
            dispatch({ type: 'SET_JOBS', payload: results });
                        return {count,totalPages};

         };
};

return {getJobs, error, isLoading};
};