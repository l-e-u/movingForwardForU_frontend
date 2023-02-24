import { useEffect } from 'react';

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

const Users = () => {
    const { getUsers } = useGetUsers();
    const { users } = useUsersContext();

    useEffect(() => {
        (async () => {
            await getUsers();
        })();
    }, []);

    return (
        <PageContentWrapper>
            <div className='mb-3'>
                <ShowCreateFormButton text='Create A User' handleOnClick={() => console.log('under construction...')} />
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
                                <SmallHeader text='Emal' />
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