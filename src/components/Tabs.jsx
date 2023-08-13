import { useState } from 'react';
import { motion } from 'framer-motion';

// accepts an array of objects
// each object must have a name, icon (bootstrap icon name), and jsx element as the content
const Tabs = ({ tabs }) => {
   const [selectedTabIndex, setSelectedTabIndex] = useState(0);

   // when there's only one tab, it should have a header label instead of a button
   const hasOneTab = tabs.length === 1;

   const handleTabOnClick = (selectedIndex) => {
      return () => setSelectedTabIndex(selectedIndex);
   };

   const parentContainerClasses = 'tabsAndContent d-flex flex-column w-100 h-100'

   // contains all the tab buttons
   const tabButtonsContainerClasses = 'tabs d-flex fs-smaller';

   // variants and styles for the tab buttons
   const tabClasses = 'text-center border-top-0 border-start-0 rounded-top flex-grow-1 pt-2 pb-1';
   const setTabStyles = (tabIsSelected) => ({
      borderBottom: tabIsSelected ? '1px solid transparent' : '1px solid var(--mainPalette7)',
      borderRight: tabIsSelected ? '1px solid var(--mainPalette7)' : '1px solid var(--bs-gray-400)',
      backgroundColor: tabIsSelected ? 'var(--mainPalette9)' : 'var(--bs-gray-100)',
      color: tabIsSelected ? 'var(--mainPalette4)' : 'var(--bs-secondary)',
   });

   // contains all the content
   const contentContainerClasses = 'content flex-grow-1 border-top-0 border-start-0 rounded-bottom';
   const contentContainerStyles = {
      borderBottom: '1px solid var(--mainPalette7)',
      borderRight: '1px solid var(--mainPalette7)',
      backgroundColor: 'var(--mainPalette9)',
      padding: hasOneTab ? '0.25rem 1rem 1rem 1rem' : '1rem'
   };


   // icon on the tab button
   const iconClasses = 'me-2';

   const contentVariants = {
      hidden: {
         opacity: 0
      },
      visible: {
         opacity: 1
      }
   };

   return (
      <div className={parentContainerClasses}>
         <div className={tabButtonsContainerClasses}>
            {
               tabs.map((tab, index) => {
                  const { name, icon } = tab;
                  const isSelected = selectedTabIndex === index;
                  const iconJSX = <i className={`${iconClasses} ${icon}`} style={{ opacity: isSelected ? '1' : '0.5' }}></i>;
                  const labelJSX = <span style={{ opacity: isSelected ? '1' : '0.5' }}>{name}</span>;

                  if (hasOneTab) {
                     return (
                        <div key={name} className={tabClasses} style={setTabStyles(true)}>
                           {iconJSX}
                           {labelJSX}
                        </div>
                     );
                  };

                  return (
                     <button
                        key={name}
                        className={tabClasses + ' cursor-pointer'}
                        style={setTabStyles(isSelected)}
                        onClick={handleTabOnClick(index)}
                        type='button'
                     >
                        {iconJSX}
                        {labelJSX}
                     </button>
                  );
               })
            }
         </div>

         <div className={contentContainerClasses} style={contentContainerStyles}>
            <motion.div
               animate='visible'
               exit='hidden'
               initial='hidden'
               key={selectedTabIndex}
               variants={contentVariants}
            >
               {tabs[selectedTabIndex].contentJSX}
            </motion.div>
         </div>
      </div>
   )
};

export default Tabs;
