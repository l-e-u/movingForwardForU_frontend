const GradientCard = ({ children }) => {
   const cardClasses = 'gradientCard position-relative w-100 h-100 overflow-hidden rounded';
   const cardStyles = { backgroundColor: 'var(--mainPalette2)' };

   const childrenClasses = 'content position-relative w-100 h-100';
   const childrenStyles = { zIndex: '5' };

   const firstColorBlockClass = 'position-absolute rounded-circle';
   const firstColorBlockStyles = {
      backgroundColor: 'var(--mainPalette4)',
      height: '80%',
      width: '70%',
      top: '-10%',
      left: '-15%',
      zIndex: '0'
   };

   const secondColorBlockClass = 'position-absolute rounded-circle';
   const secondColorBlockStyles = {
      backgroundColor: 'var(--mainPalette5)',
      height: '70%',
      width: '85%',
      top: '-20%',
      right: '-20%',
      zIndex: '0'
   };

   const thirdColorBlockClass = 'position-absolute rounded-circle';
   const thirdColorBlockStyles = {
      backgroundColor: 'var(--mainPalette3)',
      height: '75%',
      width: '85%',
      bottom: '-10%',
      right: '-15%',
      zIndex: '0'
   };

   const forthColorBlockClass = 'position-absolute rounded-circle';
   const forthColorBlockStyles = {
      backgroundColor: 'var(--mainPalette2)',
      height: '90%',
      width: '90%',
      bottom: '-50%',
      left: '-25%',
      zIndex: '0'
   };

   return (
      <div className={cardClasses} style={cardStyles}>
         <div className={firstColorBlockClass} style={firstColorBlockStyles}></div>
         <div className={secondColorBlockClass} style={secondColorBlockStyles}></div>
         <div className={thirdColorBlockClass} style={thirdColorBlockStyles}></div>
         <div className={forthColorBlockClass} style={forthColorBlockStyles}></div>

         {/* hold the content of the card */}
         <div className={childrenClasses} style={childrenStyles}>{children}</div>
      </div>
   )
}

export default GradientCard;