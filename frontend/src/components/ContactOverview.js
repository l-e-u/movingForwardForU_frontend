const ContactOverview = ({
    name,
    organization,
    address,
    billingAddress,
    email,
    note,
    phoneNumber,
    phoneExt
}) => {
    return (
        <div>
            <h4 className='text-primary'>{organization}</h4>
            <div>{name}</div>
            <div>{address}</div>
            <div>{billingAddress}</div>
            <div>{email}</div>
            <div>{phoneNumber + ' ' + phoneExt}</div>
            <div>{note}</div>
        </div>
    );
};

export default ContactOverview;