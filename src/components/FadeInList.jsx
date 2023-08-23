import { motion } from 'framer-motion';

const FadeInList = ({ items }) => {
   const listClasses = 'px-3';
   const listVariants = {
      mount: {
         listStyle: 'none',
         margin: '0',
         padding: '0'
      },
      animation: {
         transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1
         }
      }
   };

   // styling for an item in the list
   const itemVariants = {
      mount: {
         opacity: 0,
         marginBottom: '0'
      },
      animation: {
         opacity: 1,
         marginBottom: '1rem',
         transition: {
            marginBottom: {
               delay: 0.5
            }
         }
      }
   };
   return (
      <motion.ul className={listClasses} variants={listVariants} initial='mount' animate='animation'>
         {
            items.map((item, index) => (
               <motion.li key={index} variants={itemVariants}>
                  {item}
               </motion.li>
            ))
         }
      </motion.ul>
   );
};

export default FadeInList;