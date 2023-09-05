// components
import Jobs from './Jobs';

const JobsDispatcher = (props) => {
   const permissions = {
      canAddNote: true,
      canArchive: true,
      canCreate: true,
      canDelete: true,
      canEdit: true,
      filterBilling: true,
      filterCustomer: true,
      filterDrivers: true,
      filterMileage: true,
      filterStatus: true,
      showBilling: true,
      showDetails: true,
      showDrivers: true,
      showCreatedBy: true,
      showCreatedAt: true,
      showNotes: true,
   };

   const jobsDriverProps = {
      ...props,
      permissions
   };

   return <Jobs {...jobsDriverProps} />
};

export default JobsDispatcher;