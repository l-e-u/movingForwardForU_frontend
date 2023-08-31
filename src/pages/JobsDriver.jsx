// components
import Jobs from './Jobs';

const JobsDriver = (props) => {
   const permissions = {
      canAddNote: true,
      canArchive: false,
      canCreate: false,
      canDelete: false,
      canEdit: false,
      filterStatus: true,
      showBilling: false,
      showDetails: true,
      showDrivers: false,
      showCreatedBy: false,
      showCreatedAt: false,
      showNotes: true,
   };

   const jobsDriverProps = {
      ...props,
      permissions,
      subPath: '/driver'
   };

   return <Jobs {...jobsDriverProps} />
};

export default JobsDriver;