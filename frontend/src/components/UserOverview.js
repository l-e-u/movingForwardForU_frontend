// components
import SmallHeader from '../components/SmallHeader.js';

const UserOverview = ({
    comments,
    email,
    firstName,
    isActive,
    lastName,
}) => {
    return (
        <div className="d-flex flex-column gap-2">
            {isActive ? <p className='text-green m-0'>Active</p> : <p className='text-danger mb-2'>Inactive</p>}

            <div>
                <SmallHeader text='Name' />
                {firstName + ' ' + lastName}
            </div>

            <address className='m-0'>
                <SmallHeader text='Email' />
                {email}
            </address>

            {comments &&
                <div>
                    <SmallHeader text='Comments' />
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {comments}
                    </div>
                </div>
            }
        </div>
    )
};

export default UserOverview;