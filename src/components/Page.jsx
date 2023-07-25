// assets
import logo from '../assets/movingForwardArrows.svg';

// components
import NavMenu from '../components/NavMenu';

const Page = ({
   children,
   selectedLink,
   setSelectedLink,
}) => {
   return (
      <div className='page d-flex flex-column h-100'>

         <div className='topBar d-flex align-items-center p-2 ps-4' style={{ color: 'var(--mainPalette3)' }}>
            <img style={{ height: '30px', width: '30px' }} src={logo} alt='SVG logo image' className='text-reset' />
            <h1 className='fs-5 m-0 ps-3'>Moving Forward for U</h1>
         </div>

         <div className='d-flex flex-grow-1'>

            <NavMenu selectedLink={selectedLink} setSelectedLink={setSelectedLink} />

            <div
               className='content border-top border-start flex-grow-1 rounded-md-top-end-0'
               style={{
                  borderTopLeftRadius: '1.5rem',
                  borderTopRightRadius: '1.5rem',
                  backgroundColor: 'var(--mainPalette9)'
               }}>
               {children}
            </div>
         </div>
      </div>
   );
};

export default Page;
