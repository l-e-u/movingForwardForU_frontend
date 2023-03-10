import SmallHeader from './SmallHeader';

const FeeOverview = ({ amount, name, description }) => {
    return (
        <div className='d-flex flex-column gap-2'>
            <h2 className='text-primary fs-5 m-0'>{name}</h2>
            <p className='m-0'>{'$' + amount}</p>
            <div>
                <SmallHeader text='Description' />
                <p className='m-0' style={{ whiteSpace: 'pre-wrap' }}>{description}</p>
            </div>
        </div>
    );
};

export default FeeOverview;