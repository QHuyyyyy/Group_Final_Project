import * as XLSX from 'xlsx';
import { Claim } from '../models/ClaimModel';
import dayjs from 'dayjs';

export const formatClaimForExcel = (claim: Claim) => ({
  "Claim ID": claim._id,
  "Claim Name": claim.claim_name,
  "Staff Name": claim.staff_name,
  "Project": claim.project_info?.project_name || 'N/A',
  "From": dayjs(claim.claim_start_date).format('DD/MM/YYYY'),
  "To": dayjs(claim.claim_end_date).format('DD/MM/YYYY'),
  "Status": claim.claim_status,
  "Total Hours": claim.total_work_time,
  "Amount": claim.total_work_time * 50,
});

export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}; 