import { debounce } from "lodash";
import type { Claim } from "../models/ClaimModel";

export const createDebouncedSearch = (delay: number = 1000) => {
  return debounce((
    value: string,
    allClaims: Claim[],
    statusFilter: string,
    searchType: string,
    setClaimsCallback: (claims: Claim[]) => void
  ) => {
    const filteredData = allClaims.filter(claim => {
      let matchesSearch = true;
      
      if (value) {
        if (searchType === 'claim_name') {
          matchesSearch = claim.claim_name.toLowerCase().includes(value.toLowerCase());
        } else if (searchType === 'staff_name') {
          matchesSearch = claim.staff_name.toLowerCase().includes(value.toLowerCase());
        }
      }
      
      const matchesStatus = statusFilter ? claim.claim_status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });

    setClaimsCallback(filteredData);
  }, delay);
}; 