import { useState } from 'react';
import { motion } from 'framer-motion';

// accepts an array of objects
// each object must have a name, icon (bootstrap icon name), and jsx element as the content
const Tabs = ({ tabs }) => {
   const [selectedTabIndex, setSelectedTabIndex] = useState(0);

   const handleTabOnClick = (selectedIndex) => {
      return () => setSelectedTabIndex(selectedIndex);
   };

   // contains all the tab buttons
   const tabButtonsContainerClasses = 'tabs d-flex fs-smaller mb-2';

   // variants and styles for the tab buttons
   const tabButtonClasses = 'text-center rounded-top border-top-0 border-end-0 border-start-0 cursor-pointer flex-grow-1 pt-1';

   const setTabButtonStyles = (tabIsSelected) => ({
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: tabIsSelected ? 'var(--mainPalette9)' : 'transparent',
      borderBottomColor: tabIsSelected ? 'var(--mainPalette4)' : 'var(--bs-gray-500)',
      color: tabIsSelected ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
      opacity: tabIsSelected ? 1 : 0.5,
   });

   // icon on the tab button
   const iconClasses = 'me-2';

   return (
      <>
         <div className={tabButtonsContainerClasses}>
            {
               tabs.map((tab, index) => {
                  const { name, icon } = tab;
                  const isSelected = selectedTabIndex === index;

                  return (
                     <button
                        key={name}
                        className={tabButtonClasses}
                        style={setTabButtonStyles(isSelected)}
                        onClick={handleTabOnClick(index)}
                        type='button'
                     >
                        <i className={`${iconClasses} ${icon}`}></i>
                        <span>{name}</span>
                     </button>
                  );
               })
            }
         </div>
         <>
            {tabs[selectedTabIndex].contentJSX}
         </>
      </>
   )
};

export default Tabs;
