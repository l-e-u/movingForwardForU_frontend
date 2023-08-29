// components
import Jobs from './Jobs';

const JobsArchives = (props) => {
   const permissions = {
      canAddNote: true,
      canArchive: false,
      canCreate: false,
      canDelete: true,
      canEdit: false,
      showBilling: true,
      showDetails: true,
      showDrivers: true,
      showCreatedBy: true,
      showCreatedAt: true,
      showNotes: true
   };

   const jobsDriverProps = {
      ...props,
      permissions
   };

   return <Jobs {...jobsDriverProps} />
};

export default JobsArchives;