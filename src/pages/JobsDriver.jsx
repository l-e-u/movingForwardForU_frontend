// components
import Jobs from './Jobs';

const JobsDriver = (props) => {
   const permissions = {
      canAddNote: true,
      canArchive: false,
      canCreate: false,
      canDelete: false,
      canEdit: false,
      filterBilling: false,
      filterCustomer: true,
      filterDrivers: false,
      filterMileage: true,
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