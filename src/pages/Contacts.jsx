import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// hooks
import { useContactsContext } from '../hooks/useContactsContext';
import { useGetContacts } from '../hooks/useGetContacts';

// components
import AddDocumentButton from '../components/AddDocumentButton';
import Button from '../components/Button';
import CollapsingSection from '../components/CollapsingSection';
import ContactDetails from '../components/ContactDetails';
import CreateContactForm from '../components/CreateContactForm';
import DeleteForm from '../components/DeleteForm';
import EditContactForm from '../components/EditContactForm';
import ErrorAlert from '../components/ErrorAlert';
import FadeInList from '../components/FadeInList';
import FilterNavigation from '../components/FilterNavigation';
import LoadingDocuments from '../components/LoadingDocuments';
import NavPagination from '../components/NavPagination';
import SmallHeader from '../components/SmallHeader';


const Contacts = ({ filters, pagination, setFilters, setPagination }) => {
   const { getContacts, error, isLoading } = useGetContacts();
   const { contacts, dispatch } = useContactsContext();

   const [showAlphabetFiltering, setShowAlphabetFiltering] = useState(filters.organization ? true : false);

   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteForm, setShowDeleteForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

   const [selectedContact, setSelectedContact] = useState(null);

   const setCurrentPage = (number) => {
      setPagination({
         ...pagination,
         pages: {
            ...pagination.pages,
            current: number
         }
      });
   };

   // updates the results.limit when the limit is changed in nav pagination
   const onChangeLimit = (number) => {
      setPagination({
         ...pagination,
         pages: {
            ...pagination.pages,
            current: 1
         },
         results: {
            limit: number
         }
      });
   };

   useEffect(() => {
      getContacts({
         filters,
         currentPage: pagination.pages.current,
         limit: pagination.results.limit,
         setPaginationTotals: ({ totalNumberOfResults, totalNumberOfPages }) => {
            setPagination({
               ...pagination,
               pages: {
                  ...pagination.pages,
                  total: totalNumberOfPages
               },
               results: {
                  ...pagination.results,
                  total: totalNumberOfResults
               }
            })
         }
      });
   }, [filters, pagination.results.limit, pagination.pages.current]);

   return (
      <>
         <div className='my-3 px-3'>
            <NavPagination
               currentPage={pagination.pages.current}
               isFetching={isLoading}
               limit={pagination.results.limit}
               onChangeLimit={onChangeLimit}
               setCurrentPage={setCurrentPage}
               totalPages={pagination.pages.total}
            />

            <CollapsingSection isExpanded={showAlphabetFiltering}>
               <FilterNavigation
                  isFetching={isLoading}
                  currentLetter={filters.organization?.charAt(1)}
                  setLetterFilter={letter => setFilters({ ...filters, organization: `^${letter}` })}
               />
            </CollapsingSection>

            <div className='d-flex gap-3 mt-3'>
               <AddDocumentButton handleClick={() => setShowCreateForm(true)} />

               <Button handleClick={() => {
                  if (showAlphabetFiltering) {
                     const { organization, ...otherFilters } = filters;
                     if (organization) setFilters(otherFilters);
                  };
                  setShowAlphabetFiltering(!showAlphabetFiltering);
               }} >
                  <span className='fs-smaller'>A - Z</span>
                  {showAlphabetFiltering && <i className='bi bi-x-circle fs-smaller ms-3'></i>}
               </Button>

               {/* Display the total amount of search results */}
               <div className='text-secondary mt-auto ms-auto'>
                  <SmallHeader text={`Total: ${pagination.results.total}`} />
               </div>
            </div>

         </div>

         <AnimatePresence>
            {
               showCreateForm &&
               <CreateContactForm hideForm={() => setShowCreateForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedContact(null)}>
            {
               showEditForm &&
               <EditContactForm currentContact={selectedContact} hideForm={() => setShowEditForm(false)} />
            }
         </AnimatePresence>

         <AnimatePresence onExitComplete={() => setSelectedContact(null)}>
            {
               showDeleteForm &&
               <DeleteForm
                  apiRouteName='contacts'
                  deleteFromContext={deletedContact => dispatch({ type: 'DELETE_CONTACT', payload: deletedContact })}
                  documentID={selectedContact._id}
                  hideForm={() => setShowDeleteForm(false)}
                  modelName='contact'
               />
            }
         </AnimatePresence>

         <AnimatePresence mode='wait'>
            {
               !isLoading &&
               <FadeInList items={
                  contacts.map(contact => (
                     <ContactDetails
                        contact={contact}
                        showDeleteForm={() => {
                           setSelectedContact(contact);
                           setShowDeleteForm(true);
                        }}
                        showEditForm={() => {
                           setSelectedContact(contact);
                           setShowEditForm(true);
                        }}
                     />
                  ))
               } />
            }
         </AnimatePresence>

         <AnimatePresence mode='wait'>
            {isLoading && <LoadingDocuments />}
         </AnimatePresence>

         {
            error &&
            <ErrorAlert message={error.message} />
         }
      </>
   );
};

export default Contacts;