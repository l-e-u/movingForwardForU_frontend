const SmallHeader = ({ text, isRequired = false }) => {
   return <span className={'text-secondary fs-smaller' + (isRequired ? ' required' : '')}>{text}</span>;
};

export default SmallHeader;