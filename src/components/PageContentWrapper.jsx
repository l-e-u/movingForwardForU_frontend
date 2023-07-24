const PageContentWrapper = ({ children }) => {
   return (
      <div
         className='page border-top border-start flex-grow-1'
         style={{ borderTopLeftRadius: '2.5rem', backgroundColor: 'var(--bs-gray-100)' }}>
         {children}
      </div>
   );
};

export default PageContentWrapper;
