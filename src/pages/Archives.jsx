import { useState, useEffect } from 'react';

// context
import { useAuthContext } from '../hooks/useAuthContext';
import { useArchivesContext } from '../hooks/useArchiveContext';

// functions
import { urlQueryString } from '../utils/StringUtils';

// components
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments';
import FilterAndASort from '../components/FilterAndSort';
import FlexBoxWrapper from '../components/FlexBoxWrapper';
import LoadingDocuments from '../components/LoadingDocuments';
import NavPagination from '../components/NavPagination';
import PageContentWrapper from '../components/Page'
import ArchiveCard from '../components/ArchiveCard';

const Archives = ({ filters, setFilters }) => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { user } = useAuthContext();
   const { archives, dispatch } = useArchivesContext();

   // used during fetching
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);

   // pagination state
   const [limit, setLimit] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalResults, setTotalResults] = useState(0);

   // fetches results as the user chooses filters or changes limits for results
   useEffect(() => {
      const timeout = setTimeout(async () => {
         setIsLoading(true);
         setError(null);

         const filterQuery = urlQueryString(filters);

         const response = await fetch(`${API_BASE_URL}/api/archives?page=${currentPage}&limit=${limit}${filterQuery}`, {
            headers: {
               'Authentication': `Bearer ${user.token}`
            }
         });

         // expecting the list of jobs depending on page and limit
         const json = await response.json();

         if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
         };

         if (response.ok) {
            setError(null);
            setIsLoading(false);
            setTotalPages(json.totalPages);
            setTotalResults(json.count);
            dispatch({ type: 'SET_ARCHIVES', payload: json.results });

         };
      }, 250);

      return () => clearTimeout(timeout);
   }, [API_BASE_URL, currentPage, dispatch, filters, limit, user]);

   return (<PageContentWrapper>
      {/* user can select pagination page and limit for results */}
      <div className='d-flex flex-column gap-2 mb-3'>
         <NavPagination
            currentPage={currentPage}
            limit={limit}
            setCurrentPage={setCurrentPage}
            setLimit={setLimit}
            setTotalPages={setTotalPages}
            totalPages={totalPages}
            totalResults={totalResults}
         />

         <FilterAndASort filters={filters} setFilters={setFilters} userIsAdmin={true} filterArchives={true} />
      </div>

      {/* show spinner with actively fetching data */}
      {isLoading && <div className='my-5'><LoadingDocuments /></div>}

      {error && <ErrorLoadingDocuments docType='Jobs' />}

      {(archives && !isLoading) &&
         <FlexBoxWrapper>
            {/* show a message when the results have loaded and there's not results */}
            {(totalResults === 0) &&
               <div className='outline shadow-sm background-white p-3 text-center'>There are no results.</div>
            }

            {archives.map(archive => {
               const { _id } = archive;

               // by default the archive card is shown, unless the user selects to edit or delete
               switch (true) {
                  default:
                     return (<div className='position-relative' key={_id}>
                        <ArchiveCard {...archive} />
                     </div>)
               }
            })}
         </FlexBoxWrapper>
      }
   </PageContentWrapper>)
};

export default Archives;