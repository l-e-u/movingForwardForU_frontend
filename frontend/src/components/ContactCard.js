// component
import Card from './Card';
import CreatedInfo from './CreatedInfo';
import SmallHeader from './SmallHeader';

const ContactCard = ({
    address,
    billingAddress,
    createdAt,
    createdBy,
    email,
    misc,
    name,
    organization,
    phoneExt,
    phoneNumber,
}) => {
    return (
        <Card
            header={<div>{organization}</div>}
            body={<>
                <address className='m-0'>
                    <div className='mb-2'>
                        <SmallHeader text='Address' />
                        <i className='bi bi-geo-alt text-action me-2'></i><span>{address}</span>
                    </div>
                    {billingAddress &&
                        <div className='mt-2'>
                            <SmallHeader text='Billing Address' />
                            <div>{billingAddress}</div>
                        </div>
                    }
                    {(name ?? email ?? phoneNumber) &&
                        <div className='mt-2'>
                            <SmallHeader text='Point of Contact' />
                            {name && <div><i className='bi bi-person text-action me-2'></i><span>{name}</span></div>}
                            {email && <div><i className='bi bi-envelope text-action me-2'></i><span>{email}</span></div>}
                            {phoneNumber && <div><i className='bi bi-telephone text-action me-2'></i><span>{phoneNumber + (phoneExt ? ' x' + phoneExt : '')}</span></div>}
                        </div>
                    }
                </address>

                {misc &&
                    <div className='mt-2'>
                        <SmallHeader text='Miscellaneous' />
                        <p className='m-0' style={{ whiteSpace: 'pre-wrap' }}>{misc}</p>
                    </div>
                }
            </>}
            footer={<CreatedInfo createdAt={createdAt} createdBy={createdBy} />}
        />
    );
};

export default ContactCard;