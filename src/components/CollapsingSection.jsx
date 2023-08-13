import { motion } from 'framer-motion';

const CollapsingSection = ({ children, isExpanded }) => {
   return (
      <motion.div
         className='myCollapsingSection d-grid overflow-hidden'
         initial={{
            marginTop: '0rem',
            gridTemplateRows: '0fr',
         }}
         animate={{
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            marginTop: isExpanded ? '1rem' : '0rem',
            transition: {
               duration: 0.3
            }
         }}
      >
         <div className='section overflow-hidden'>
            {children}
         </div>
      </motion.div>
   )
}

export default CollapsingSection;