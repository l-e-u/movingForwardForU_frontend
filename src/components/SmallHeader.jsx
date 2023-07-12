const SmallHeader = ({ text, isRequired = false }) => {
    return <h3 className={'text-secondary fw-normal fs-6 m-0 text-capitalize' + (isRequired ? ' required' : '')}><small>{text}</small></h3>;
};

export default SmallHeader;