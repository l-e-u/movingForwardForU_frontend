import { motion } from 'framer-motion';

const CollapsingSection = ({ children, className, maxHeight, isExpanded }) => {
   return (
      <motion.div
         className='myCollapsingSection d-grid overflow-hidden'
         initial={{
            maxHeight,
            height: '0px',
         }}
         animate={{
            height: isExpanded ? maxHeight : '0px',
            transition: {
               duration: 0.3
            }
         }}
      >
         <div className={`section overflow-hidden ${className || ''}`}>
            {children}
         </div>
      </motion.div>
   )
}

export default CollapsingSection;