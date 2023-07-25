import { useState, useEffect, useRef } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useContactsContext } from '../hooks/useContactsContext'

// components
import ActionButton from '../components/ActionButton';
import CreateContactForm from '../components/CreateContactForm';
import ContactCard from '../components/ContactCard';
import DeleteConfirmation from '../components/DeleteConfirmation';
import EditContactForm from '../components/EditContactForm';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments';
import FlexBoxWrapper from '../components/FlexBoxWrapper';
import LoadingDocuments from '../components/LoadingDocuments';
import OptionsMenu from '../components/OptionsMenu';
import PageContentWrapper from '../components/Page';

const Contacts = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { contacts, dispatch } = useContactsContext();
   const { user } = useAuthContext();

   const editFormRef = useRef(null);

   // local state
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);
   const [selectedContactId, setSelectedContactId] = useState(null);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [showOptionsMenu, setShowOptionsMenu] = useState(false);

   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            headers: {
               'Content-Type': 'application/json',
               'Authentication': `Bearer ${user.token}`
            }
         });

         // expecting all contacts
         const json = await response.json();

         if (!response.ok) {
            console.error(json);
            setError(json.error);
            setIsLoading(false);
         };

         if (response.ok) {
            setError(null);
            setIsLoading(false);
            dispatch({ type: 'SET_CONTACTS', payload: json });
         };
      })();
   }, [API_BASE_URL, dispatch, user]);

   useEffect(() => {
      if (showEditForm) scrollToBottom();
   }, [showEditForm]);

   const scrollToBottom = () => {
      editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   // sets all the forms and menus show setters to false
   const hideAllMenusAndForms = () => [setShowEditForm, setShowCreateForm, setShowOptionsMenu, setShowDeleteConfirmation].forEach(setShow => setShow(false));

   return (
      <PageContentWrapper>
         <div className='mb-3 position-relative' style={{ zIndex: '2' }}>
            {showCreateForm ?
               <CreateContactForm setShowThisForm={setShowCreateForm} /> :
               <ActionButton
                  alignX='right'
                  handleOnClick={() => {
                     hideAllMenusAndForms();
                     setShowCreateForm(true);
                     setSelectedContactId(null);
                  }}
                  text='Create a Contact'
               />
            }
         </div>

         {/* show spinner with actively fetching data */}
         {isLoading && <div className='my-5'><LoadingDocuments /></div>}

         {error && <ErrorLoadingDocuments docType='Jobs' />}

         {contacts &&
            <FlexBoxWrapper>
               {contacts.map((contact) => {
                  const { _id } = contact;
                  const isSelectedContact = selectedContactId === _id;

                  // by default, an overview of the model is displayed, unless the user clicks on an option
                  switch (true) {
                     case (showEditForm && isSelectedContact):
                        return (<div className='position-relative' style={{ zIndex: '2' }} key={_id} ref={editFormRef}>
                           <EditContactForm prevContact={contact} setShowThisForm={setShowEditForm} />
                        </div>);

                     case (showDeleteConfirmation && isSelectedContact):
                        return (<div className='position-relative' key={_id}>
                           <DeleteConfirmation
                              dispatch={dispatch}
                              doc_id={_id}
                              message={'Are you sure you want to delete this contact?\nThis cannot be undone.'}
                              model='CONTACT'
                              checkReference='customer'
                              route='contacts'
                              setShowThisForm={setShowDeleteConfirmation}
                           />
                        </div>);

                     default:
                        return (<div className='position-relative' key={_id}>
                           <OptionsMenu
                              showMenu={showOptionsMenu && isSelectedContact}
                              handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
                              handleOnClickDeleteOption={() => {
                                 hideAllMenusAndForms();
                                 setShowDeleteConfirmation(true);
                              }}
                              handleOnClickEditOption={() => {
                                 hideAllMenusAndForms();
                                 setShowEditForm(true);

                              }}
                              handleOnClickMenu={() => {
                                 hideAllMenusAndForms();
                                 setSelectedContactId(_id);
                                 setShowOptionsMenu(true);
                              }}
                           />
                           <ContactCard {...contact} />
                        </div>);
                  }
               })}
            </FlexBoxWrapper>
         }
      </PageContentWrapper>
   );
};

export default Contacts;