import { useEffect, useState } from 'react';

// components
import PageContentWrapper from '../components/PageContentWrapper.js';
import CardContainer from '../components/CardContainer.js';
import CreatedInfo from '../components/CreatedInfo.js';
import FlexBoxWrapper from '../components/FlexBoxWrapper.js';
import ShowCreateFormButton from '../components/ShowCreateFormButton.js';
import SmallHeader from '../components/SmallHeader.js';

// hooks
import { useGetUsers } from '../hooks/useGetUsers.js';
import { useUsersContext } from '../hooks/useUsersContext.js';
import CreateUserForm from '../components/CreateUserForm.js';

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

    return (
        <PageContentWrapper>
            <div className='mb-4'>
                {showCreateForm ?
                    <CreateUserForm setShowThisForm={setShowCreateForm} /> :
                    <ShowCreateFormButton text='Create A User' handleOnClick={() => setShowCreateForm(true)} />
                }
            </div>

            <FlexBoxWrapper>
                {users && users.map((u) => {
                    return (
                        <CardContainer key={u._id} hasCreatedInfo={true}>
                            {u.isActive ? <p className='text-green mb-2'>Active</p> : <p className='text-danger mb-2'>Inactive</p>}

                            <div className='mb-2'>
                                <SmallHeader text='Name' />
                                {u.firstName + ' ' + u.lastName}
                            </div>

                            <address className='m-0'>
                                <SmallHeader text='Email' />
                                {u.email}
                            </address>
                            <CreatedInfo createdAt={u.createdAt} createdBy={u.createdBy} />
                        </CardContainer>
                    );
                })
                }
            </FlexBoxWrapper>
        </PageContentWrapper>
    );
};

export default Users;