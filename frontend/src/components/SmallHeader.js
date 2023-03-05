const SmallHeader = ({ text, isRequired = false }) => {
    return <h3 className={'text-secondary fw-normal text-capitalize fs-6 m-0' + (isRequired ? ' required' : '')}><small>{text}</small></h3>;
};

export default SmallHeader;