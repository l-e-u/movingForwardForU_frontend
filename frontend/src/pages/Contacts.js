import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useContactsContext } from '../hooks/useContactsContext.js'

// components
import CreateContactForm from '../components/CreateContactForm.js';
import EditContactForm from '../components/EditContactForm.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import PageContentWrapper from '../components/PageContentWrapper.js';
import ActionButton from '../components/ActionButton.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import OptionsMenu from '../components/OptionsMenu.js';
import ContactCard from '../components/ContactCard.js';

const Contacts = () => {
    const { contacts, dispatch } = useContactsContext();
    const { user } = useAuthContext();

    // local state
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);


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

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateContactForm setShowThisForm={setShowCreateForm} /> :
                    <ActionButton
                        alignX='right'
                        handleOnClick={() => {
                            setShowCreateForm(true);
                            setShowEditForm(false);
                            setShowOptionsMenu(false);
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

                        switch (true) {
                            case (showEditForm && isSelectedContact):
                                return (<div className='position-relative' key={_id}>
                                    <EditContactForm prevContact={contact} setShowThisForm={setShowEditForm} />
                                </div>);

                            default:
                                return (<div className='position-relative' key={_id}>
                                    <OptionsMenu
                                        showMenu={showOptionsMenu && isSelectedContact}
                                        handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
                                        handleOnClickEditOption={() => {
                                            setShowEditForm(true);
                                            setShowCreateForm(false);
                                            setShowOptionsMenu(false);
                                        }}
                                        handleOnClickMenu={() => {
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