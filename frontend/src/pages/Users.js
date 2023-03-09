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

// hooks
import { useGetUsers } from '../hooks/useGetUsers.js';
import { useUsersContext } from '../hooks/useUsersContext.js';
import EditUserForm from '../components/EditUserForm.js';

const Users = () => {
    const { getUsers } = useGetUsers();
    const { users } = useUsersContext();

    // local state
    const [docToEdit, setDocToEdit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        (async () => {
            await getUsers();
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

            <FlexBoxWrapper>
                {users &&
                    users.map((u) => {
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
        </PageContentWrapper>
    );
};

export default Users;