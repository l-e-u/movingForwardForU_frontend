import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useContactsContext } from '../hooks/useContactsContext.js'

// components
import CardContainer from '../components/CardContainer.js'
import CreateContactForm from '../components/CreateContactForm.js';
import CreatedInfo from '../components/CreatedInfo.js';
import EditDocIcon from '../components/EditDocIcon.js';
import EditContactForm from '../components/EditContactForm.js';
import ContactOverview from '../components/ContactOverview.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import ShowCreateFormButton from '../components/ShowCreateFormButton.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';

const Contacts = () => {
    const { contacts, dispatch } = useContactsContext();
    const { user } = useAuthContext();

    // local state
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/contacts', {
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
    }, [dispatch, user]);

    // function closure returns a func that sets the contact to be edited, hides the CreateStatusForm and shows EditStatusForm
    const handleEditClick = (contact) => {
        return () => {
            setDocToEdit(contact);
            setShowCreateForm(false);
            setShowEditForm(true);
        };
    };

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateContactForm setShowThisForm={setShowCreateForm} /> :
                    <ShowCreateFormButton
                        handleOnClick={() => {
                            setShowCreateForm(true);
                            setShowEditForm(false);
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
                        const { _id, createdBy, createdAt } = contact;
                        const isEditingThisDoc = showEditForm && (_id === docToEdit._id);

                        return (
                            <CardContainer key={_id} hasCreatedInfo={true}>
                                {/* Edit and Delete options */}
                                <div className='position-absolute top-0 end-0 pe-3 pt-2 d-flex'>
                                    {!isEditingThisDoc && <EditDocIcon onClick={handleEditClick(contact)} />}
                                </div>

                                {isEditingThisDoc ?
                                    <EditContactForm prevContact={contact} setShowThisForm={setShowEditForm} /> :
                                    <ContactOverview {...contact} />
                                }
                                <CreatedInfo createdBy={createdBy} createdAt={createdAt} />
                            </CardContainer>
                        );
                    })}
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Contacts;