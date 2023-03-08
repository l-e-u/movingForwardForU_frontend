import SmallHeader from './SmallHeader';

const ContactOverview = ({
    name,
    organization,
    address,
    billingAddress,
    email,
    misc,
    phoneNumber,
    phoneExt
}) => {
    return (
        <div>
            <h2 className='text-primary fs-5 m-0'>{organization}</h2>
            <address className='m-0'>
                <div>{address}</div>
                <hr className='text-secondary'></hr>
                {billingAddress &&
                    <div className='mt-2'>
                        <SmallHeader text='Billing Address' />
                        <div>{billingAddress}</div>
                    </div>
                }
                {(name ?? email ?? phoneNumber) &&
                    <div className='mt-2'>
                        <SmallHeader text='Contact' />
                        {name && <div>{name}</div>}
                        {email && <div>{email}</div>}
                        {phoneNumber && <div>{phoneNumber + (phoneExt ? ' x' + phoneExt : '')}</div>}
                    </div>
                }
            </address>
            {misc &&
                <div className='mt-2'>
                    <SmallHeader text='Miscellaneous' />
                    <p className='m-0' style={{ whiteSpace: 'pre-wrap' }}>{misc}</p>
                </div>
            }
        </div>
    );
};

export default ContactOverview;