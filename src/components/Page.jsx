const Page = ({ children, }) => {
   const pageClasses = 'page flex-grow-1 overflow-auto h-100';
   const pageStyles = { backgroundColor: 'var(--mainPalette9)' };

   return (
      <div className={pageClasses} style={pageStyles}>{children}</div>
   );
};

export default Page;
