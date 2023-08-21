// on bigger screens this gains margin left for the navMenu, which is set in CSS

const Page = ({ children, }) => {
   const pageClasses = 'page position-relative bg-none flex-grow-1 overflow-auto';

   return (
      <div className={pageClasses}>{children}</div>
   );
};

export default Page;
