// component
import Card from './Card';
import CreatedInfo from './CreatedInfo';
import SmallHeader from './SmallHeader';

// functions
import { formatCurrency } from '../utils/StringUtils';
import { addTwoCurrencies } from '../utils/NumberUtils';

const ContactCard = ({
    address,
    billingAddress,
    createdAt,
    createdBy,
    defaultFees,
    email,
    misc,
    name,
    organization,
    phoneExt,
    phoneNumber,
}) => {
    const hasDefaultFees = defaultFees.length > 0;

    defaultFees.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

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

                {hasDefaultFees &&
                    <div className='my-2'>
                        <SmallHeader text='Default Fees' />
                        <ul className='m-0 list-group'>
                            {defaultFees.map(fee => {
                                const { _id, amount, name } = fee;
                                let currency = formatCurrency(amount, true);

                                if (amount < 0) currency = '(' + currency + ')';

                                return (
                                    <li key={_id} className='list-group-item d-flex border-0 p-0 text-reset'>
                                        <span>{name}</span>
                                        <span className='flex-grow-1 text-end text-nowrap'>{'$ ' + currency}</span>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className='d-flex align-items-center justify-content-end mt-1'>
                            <SmallHeader text='Total' />
                            <span className='border-top ms-2 ps-2'>
                                {'$ ' + formatCurrency(defaultFees.reduce((total, dFee) => addTwoCurrencies(total, dFee.amount), 0), true)}
                            </span>
                        </div>
                    </div>
                }

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