// components
import Jobs from './Jobs';

const JobsDriver = (props) => {
   const permissions = {
      canAddNote: true,
      canArchive: false,
      canCreate: false,
      canDelete: false,
      canEdit: false,
      showBilling: false,
      showDetails: true,
      showDrivers: false,
      showCreatedBy: false,
      showCreatedAt: false,
      showNotes: true,
   };

   const jobsDriverProps = {
      ...props,
      permissions
   };

   return <Jobs {...jobsDriverProps} />
};

export default JobsDriver;