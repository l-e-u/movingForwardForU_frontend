// on bigger screens this gains margin left for the navMenu, which is set in CSS

const Page = ({ children, }) => {
   const pageClasses = 'page flex-grow-1 overflow-auto';
   const pageStyles = { backgroundColor: 'var(--mainPalette9)' };

   return (
      <div className={pageClasses} style={pageStyles}>{children}</div>
   );
};

export default Page;
