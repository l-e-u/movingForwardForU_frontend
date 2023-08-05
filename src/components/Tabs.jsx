import { useState } from 'react';
import { motion } from 'framer-motion';

// accepts an array of objects
// each object must have a name, icon (bootstrap icon name), and jsx element as the content
const Tabs = ({ tabs }) => {
   const [selectedTabIndex, setSelectedTabIndex] = useState(0);

   const tabButtonsJSX = [];
   const tabContentJSX = [];

   const handleTabOnClick = (selectedIndex) => {
      return () => setSelectedTabIndex(selectedIndex);
   };

   const tabButtonsContainerClasses = 'tabs d-flex fs-smaller mb-2';

   const iconClasses = 'me-2';

   const tabButtonClasses = 'text-center border-top-0 border-end-0 border-start-0 cursor-pointer flex-grow-1';
   const tabButtonVariants = {
      mount: {
         backgroundColor: 'transparent',
         borderBottomWidth: '1px',
         borderBottomStyle: 'solid',
         borderBottomColor: 'var(--bs-gray-300)',
         color: 'var(--bs-secondary)',
         opacity: 0.5,
      },
      onHover: {
         opacity: 1
      }
   };

   tabs.forEach((tab, index) => {
      const { name, icon, contentJSX } = tab;
      const isSelected = selectedTabIndex === index;
      let variants = { ...tabButtonVariants };

      // if the current tab is the one selected, override some of the styles
      if (isSelected) {
         variants = {
            ...variants,
            mount: {
               ...variants.mount,
               backgroundColor: 'var(--mainPalette9)',
               borderBottomColor: 'var(--mainPalette4)',
               color: 'var(--mainPalette4)',
               opacity: 1
            }
         }
      };

      tabButtonsJSX.push(
         <motion.button
            key={name}
            className={tabButtonClasses}
            initial='mount'
            onClick={handleTabOnClick(index)}
            type='button'
            variants={variants}
            whileHover='onHover'
         >
            <i className={`${iconClasses} ${icon}`}></i><span>{name}</span>
         </motion.button>
      );

      tabContentJSX.push(contentJSX);
   });

   return (
      <>
         <div className={tabButtonsContainerClasses}>
            {tabButtonsJSX}
         </div>
         <>
            {tabContentJSX[selectedTabIndex]}
         </>
      </>
   )
};

export default Tabs;
