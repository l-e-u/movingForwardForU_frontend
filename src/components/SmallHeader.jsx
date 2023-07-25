const SmallHeader = ({ text, isRequired = false }) => {
   return <span className={'fs-smaller' + (isRequired ? ' required' : '')} style={{ color: 'var(--bs-gray-600)' }}>{text}</span>;
};

export default SmallHeader;