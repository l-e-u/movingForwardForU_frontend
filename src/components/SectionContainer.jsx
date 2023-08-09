const SectionContainer = ({ children }) => {
   return (
      <div
         className='section rounded p-3'
         style={{
            backgroundColor: 'var(--bs-gray-100',
            borderRight: '1px solid var(--bs-gray-400)',
            borderBottom: '1px solid var(--bs-gray-400)',
         }}
      >
         {children}
      </div>
   );
};

export default SectionContainer;