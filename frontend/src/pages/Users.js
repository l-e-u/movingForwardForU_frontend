import { useEffect, useState } from 'react';

// components
import PageContentWrapper from '../components/PageContentWrapper.js';
import CardContainer from '../components/CardContainer.js';
import CreatedInfo from '../components/CreatedInfo.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import ShowCreateFormButton from '../components/ShowCreateFormButton.js';
import CreateUserForm from '../components/CreateUserForm.js';
import UserOverview from '../components/UserOverview.js';
import EditDocIcon from '../components/EditDocIcon.js';
import EditUserForm from '../components/EditUserForm.js';
import LoadingDocuments from '../components/LoadingDocuments.js';
import ErrorLoadingDocuments from '../components/ErrorLoadingDocuments.js';

// hooks
import { useUsersContext } from '../hooks/useUsersContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';

const Users = () => {
    const { user } = useAuthContext();
    const { users, dispatch } = useUsersContext();

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
    }, []);

    const handleOnClickShowEditForm = (user) => {
        return () => {
            setDocToEdit(user);
            setShowCreateForm(false);
            setShowEditForm(true);
        };
    };

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                {showCreateForm ?
                    <CreateUserForm setShowThisForm={setShowCreateForm} /> :
                    <ShowCreateFormButton text='Create A User' handleOnClick={() => {
                        setShowCreateForm(true);
                        setShowEditForm(false);
                    }}
                    />
                }
            </div>

            {/* show spinner with actively fetching data */}
            {isLoading && <div className='my-5'><LoadingDocuments /></div>}

            {error && <ErrorLoadingDocuments docType='Jobs' />}

            {users &&
                <FlexBoxWrapper>
                    {users.map((u) => {
                        const { _id, createdAt } = u;
                        const isEditingThisDoc = showEditForm && (_id === docToEdit._id);

                        return (
                            <CardContainer key={_id} hasCreatedInfo={true}>
                                {/* Edit and Delete options */}
                                <div className='position-absolute top-0 end-0 pe-3 pt-2 d-flex'>
                                    {!isEditingThisDoc && <EditDocIcon onClick={handleOnClickShowEditForm(u)} />}
                                </div>

                                {isEditingThisDoc ?
                                    <EditUserForm prev={u} setShowThisForm={setShowEditForm} /> :
                                    <UserOverview {...u} />
                                }
                                <CreatedInfo createdAt={createdAt} />
                            </CardContainer>
                        );
                    })
                    }
                </FlexBoxWrapper>
            }
        </PageContentWrapper>
    );
};

export default Users;