import * as XLSX from 'xlsx';

export const exportToExcel = () => {
   const dataSet = jobs.map(job => {
      const pickupDate = new Date(job.pickup.date);
      const deliveryDate = new Date(job.delivery.date);
      const pickupTime = job.pickup.includeTime ? String(pickupDate.getHours()).padStart(2, '0') + String(pickupDate.getMinutes()).padStart(2, '0') : '';
      const deliveryTime = job.delivery.includeTime ? String(deliveryDate.getHours()).padStart(2, '0') + String(deliveryDate.getMinutes()).padStart(2, '0') : '';
      let driversString = '';
      let notesString = '';

      job.drivers.forEach((driver, index, arr) => {
         driversString += driver.lastName + ', ' + driver.firstName;
         if (arr[index + 1]) driversString += ';\n';
      });

      job.notes.forEach((note, index, arr) => {
         notesString += `[${note.subject}]\n${note.message}\n<${new Date(note.createdAt).toString()} by ${note.createdBy.firstName} ${note.createdBy.lastName}>`;
         if (arr[index + 1]) notesString += ';\n';
      });

      return {
         'Reference#': job.reference,
         'Status ID': job.status._id,
         'Status': job.status.name,
         'Customer ID': job.customer._id,
         'Customer': job.customer.organization,
         'Drivers': driversString,
         'Parcel': job.parcel,
         'Mileage': job.mileage,
         'Pickup Address': job.pickup.address,
         'Delivery Address': job.delivery.address,
         'Pickup Date': pickupDate,
         'Pickup Time': pickupTime,
         'Delivery Date': deliveryDate,
         'Delivery Time': deliveryTime,
         'Notes': notesString,
      }
   });

   // set the max column width default
   const maxColWidth = Array(Object.keys(dataSet[0]).length).fill().map(() => ({ wch: 15 }));

   dataSet.forEach(row => {
      Object.values(row).forEach((value, index) => {
         // skip date objects
         if (typeof value === 'object') return;
         maxColWidth[index].wch = Math.max(maxColWidth[index].wch, value.length);
      });
   });

   // create the worksheet with the dataset
   const worksheet = XLSX.utils.json_to_sheet(dataSet, { cellDates: true, dateNF: 'YYYY-MM-DD' });

   worksheet['!cols'] = maxColWidth;

   // create a new workbook
   const workbook = XLSX.utils.book_new();

   // name then append the worksheet to the workbook
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

   const fileDate = new Date();
   const fileName = `${fileDate.getFullYear()}-${String(fileDate.getMonth() + 1).padStart(2, '0')}-${String(fileDate.getDate()).padStart(2, '0')}_${String(fileDate.getHours()).padStart(2, '0')}${String(fileDate.getMinutes()).padStart(2, '0')}_ExportedJobs.xlsx`;

   // attempt to force download on the browser
   XLSX.writeFile(workbook, fileName);
};