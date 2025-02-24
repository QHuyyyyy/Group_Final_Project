// src/hooks/useRoleMapping.ts
import { useState, useEffect } from 'react';
import { roleService } from '../services/roleService';

interface RoleMapping {
  [key: string]: string;
}

export const useRoleMapping = () => {
  const [roleMapping, setRoleMapping] = useState<RoleMapping>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await roleService.getAllRoles();
        const mapping = roles.reduce((acc: RoleMapping, role) => {
          acc[role.role_code] = role.role_name;
          return acc;
        }, {});
        setRoleMapping(mapping);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const getRoleName = (roleCode: string): string => {
    return roleMapping[roleCode] || roleCode;
  };

  return { getRoleName, loading };
};