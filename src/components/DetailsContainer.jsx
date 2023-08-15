const DetailsContainer = ({ children }) => {
   return (
      <div
         className='position-relative bg-white container-fluid rounded p-3 border-top-0 border-start-0'
         style={{
            borderRight: '1px solid var(--mainPalette6)',
            borderBottom: '1px solid var(--mainPalette6)'
         }}
      >
         {children}
      </div>
   );
};

export default DetailsContainer;