import { useEffect, useState, useRef } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';
import { useStatusesContext } from '../hooks/useStatusesContext';

// components
import EditStatusForm from '../components/EditStatusForm';
import CreateStatusForm from '../components/CreateStatusForm';
import CreatedInfo from '../components/CreatedInfo';
import FlexBoxWrapper from '../components/FlexBoxWrapper';
import PageContentWrapper from '../components/PageContentWrapper';
import ActionButton from '../components/ActionButton';
import LoadingDocuments from '../components/LoadingDocuments';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments';
import OptionsMenu from '../components/OptionsMenu';
import Card from '../components/Card';
import SmallHeader from '../components/SmallHeader';
import DeleteConfirmation from '../components/DeleteConfirmation';

const Statuses = () => {
   const API_BASE_URL = process.env.API_BASE_URL;
   const { statuses, dispatch } = useStatusesContext();
   const { user } = useAuthContext();

   const editFormRef = useRef(null);

   // local state
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(null);
   const [selectedStatusId, setSelectedStatusId] = useState(null);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);
   const [showOptionsMenu, setShowOptionsMenu] = useState(false);

   useEffect(() => {
      if (showEditForm) editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [showEditForm]);

   // get statuses once
   useEffect(() => {
      (async () => {
         setIsLoading(true);
         setError(null);

         const response = await fetch(`${API_BASE_URL}/api/statuses`, {
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
            dispatch({ type: 'SET_STATUSES', payload: json });
         };
      })();
   }, [API_BASE_URL, dispatch, user]);

   // sets all the forms and menus show setters to false
   const hideAllMenusAndForms = () => [setShowEditForm, setShowCreateForm, setShowOptionsMenu, setShowDeleteConfirmation].forEach(setShow => setShow(false));

   return (
      <PageContentWrapper>
         <div className='mb-3'>
            {showCreateForm ?
               <CreateStatusForm setShowThisForm={setShowCreateForm} /> :
               <ActionButton
                  alignX='right'
                  handleOnClick={() => {
                     hideAllMenusAndForms();
                     setShowCreateForm(true);
                     setSelectedStatusId(null);
                  }}
                  text='Create a Status'
               />
            }
         </div>

         {/* show spinner with actively fetching data */}
         {isLoading && <div className='my-5'><LoadingDocuments /></div>}

         {error && <ErrorLoadingDocuments docType='Jobs' />}

         {statuses &&
            <FlexBoxWrapper>
               {statuses.map((status) => {
                  const { _id } = status;
                  const isSelectedStatus = selectedStatusId === _id;

                  switch (true) {
                     case (showEditForm && isSelectedStatus):
                        return (<div className='position-relative' key={_id} ref={editFormRef}>
                           <EditStatusForm prevStatus={status} setShowThisForm={setShowEditForm} />
                        </div>);

                     case (showDeleteConfirmation && isSelectedStatus):
                        return (<div className='position-relative' key={_id}>
                           <DeleteConfirmation
                              dispatch={dispatch}
                              doc_id={_id}
                              message={'Are you sure you want to delete this status?\nThis cannot be undone.'}
                              model='STATUS'
                              checkReference='status'
                              route='statuses'
                              setShowThisForm={setShowDeleteConfirmation}
                           />
                        </div>);

                     default:
                        return (<div className='position-relative' key={_id}>
                           <OptionsMenu
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
                                 setSelectedStatusId(_id);
                                 setShowOptionsMenu(true);
                              }}
                              showMenu={showOptionsMenu && isSelectedStatus}
                           />
                           <Card
                              header={<div>{status.name}</div>}
                              body={
                                 <div>
                                    <SmallHeader text='Description' />
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{status.description}</p>
                                 </div>
                              }
                              footer={<CreatedInfo createdAt={status.createdAt} createdBy={status.createdBy} />}
                           />
                        </div>)
                  }
               })}
            </FlexBoxWrapper>
         }
      </PageContentWrapper>
   );
};

export default Statuses;