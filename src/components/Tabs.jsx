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
   const tabButtonsContainerClasses = 'tabs d-flex fs-smaller';

   const contentContainerClasses = 'border-top-0 border-start-0 rounded-bottom p-3';
   const contentContainerStyles = {
      borderBottom: '1px solid var(--mainPalette7)',
      borderRight: '1px solid var(--mainPalette7)',
      backgroundColor: 'var(--mainPalette9)'
   }

   // variants and styles for the tab buttons
   const tabButtonClasses = 'text-center border-top-0 border-start-0 rounded-top cursor-pointer flex-grow-1 pt-2 pb-1';

   const setTabButtonStyles = (tabIsSelected) => ({
      borderBottom: tabIsSelected ? '1px solid transparent' : '1px solid var(--mainPalette7)',
      borderRight: tabIsSelected ? '1px solid var(--mainPalette7)' : '1px solid var(--bs-gray-400)',
      backgroundColor: tabIsSelected ? 'var(--mainPalette9)' : 'var(--bs-gray-100)',
      color: tabIsSelected ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
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
                        <i className={`${iconClasses} ${icon}`} style={{ opacity: isSelected ? '1' : '0.5' }}></i>
                        <span style={{ opacity: isSelected ? '1' : '0.5' }}>{name}</span>
                     </button>
                  );
               })
            }
         </div>
         <div className={contentContainerClasses} style={contentContainerStyles}>
            {tabs[selectedTabIndex].contentJSX}
         </div>
      </>
   )
};

export default Tabs;
