import { useEffect, useState, useRef } from 'react';

// components
import PageContentWrapper from '../components/PageContentWrapper.js';
import CreatedInfo from '../components/CreatedInfo.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import ActionButton from '../components/ActionButton.js';
import CreateUserForm from '../components/CreateUserForm.js';
import EditUserForm from '../components/EditUserForm.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';
import SmallHeader from '../components/SmallHeader.js';
import OptionsMenu from '../components/OptionsMenu.js';
import Card from '../components/Card.js';

// hooks
import { useUsersContext } from '../hooks/useUsersContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

const Users = () => {
    const { user } = useAuthContext();
    const { users, dispatch } = useUsersContext();

    const editFormRef = useRef(null);

    // local state
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

    useEffect(() => {
        if (showEditForm) editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [showEditForm]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/users', {
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

                dispatch({ type: 'SET_USERS', payload: json });
            };
        })();
    }, [dispatch, user]);

    // sets all the forms and menus show setters to false
    const hideAllMenusAndForms = () => [setShowEditForm, setShowCreateForm, setShowOptionsMenu].forEach(setShow => setShow(false));

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateUserForm setShowThisForm={setShowCreateForm} /> :
                    <ActionButton
                        alignX='right'
                        handleOnClick={() => {
                            hideAllMenusAndForms();
                            setShowCreateForm(true);
                            setSelectedUserId(null);
                        }}
                        text='Create A User'
                    />
                }
            </div>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Users' />}

            {users &&
                <FlexBoxWrapper>
                    {users.map((u) => {
                        const { _id, address, comments, createdAt, email, firstName, isActive, isAdmin, isVerified, lastName } = u;
                        const isSelectedUser = selectedUserId === _id;


                        switch (true) {
                            case (showEditForm && isSelectedUser):
                                return (<div className='position-relative' key={_id} ref={editFormRef}>
                                    <EditUserForm prev={u} setShowThisForm={setShowEditForm} />
                                </div>);

                            default:
                                return (<div className='position-relative' key={_id}>
                                    <OptionsMenu
                                        showMenu={showOptionsMenu && isSelectedUser}
                                        handleOnClickCloseMenu={() => setShowOptionsMenu(false)}
                                        handleOnClickEditOption={() => {
                                            hideAllMenusAndForms();
                                            setShowEditForm(true);
                                        }}
                                        handleOnClickMenu={() => {
                                            hideAllMenusAndForms();
                                            setSelectedUserId(_id);
                                            setShowOptionsMenu(true);
                                        }}
                                    />
                                    <Card
                                        header={<div>{firstName + ' ' + lastName + (isAdmin ? ' (Admin)' : '')}</div>}
                                        body={
                                            <div>
                                                <SmallHeader text='Status' />
                                                <p className='mb-2'>{isActive ? 'Active' : 'Inactive'}</p>

                                                <SmallHeader text='Email' />
                                                <div className='mb-2'>
                                                    <i className='bi bi-envelope text-action me-2'></i>
                                                    {isVerified && <i className='bi bi-patch-check text-action me-2'></i>}
                                                    <span>{email}</span>
                                                </div>

                                                {address && <>
                                                    <SmallHeader text='Address' />
                                                    <i className='bi bi-geo-alt text-action me-2'></i> <span>{address}</span>
                                                </>}

                                                {comments && <>
                                                    <SmallHeader text='Comments' />
                                                    <p style={{ whiteSpace: 'pre-wrap' }}>{comments}</p>
                                                </>}
                                            </div>
                                        }
                                        footer={<CreatedInfo createdAt={createdAt} />}
                                    />

                                </div>)
                        }
                    })
                    }
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Users;