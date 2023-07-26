// assets
import logo from '../assets/movingForwardArrows.svg';

// components
import NavMenu from './SideNavMenu';

const Page = ({
   children,
   selectedLink,
   setSelectedLink,
}) => {
   return (
      <div className='page'>
         {children}
      </div >
   );
};

export default Page;
