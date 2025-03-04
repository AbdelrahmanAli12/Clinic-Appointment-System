import { UserContext } from '@/context/UserContext';
import { ROUTES } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import React, { useContext, useMemo } from 'react';

function hasRequiredPermissions(requiredPermissions: string[], currentRole: string): boolean {
  if (!currentRole) return false;
  return requiredPermissions.includes(currentRole);
}

export function withRoles(Component: any, requiredPermissions: string[], isPage?: boolean) {
  return function WithRolesWrapper(props: any) {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const role = useMemo(() => loggedInUser?.role ?? null, [loggedInUser?.role]);
    const hasPermission = hasRequiredPermissions(requiredPermissions, role);
    const router = useRouter();

    if (hasPermission) {
      return <Component {...props} />;
    } else {
      if (isPage === true) {
        router.push(ROUTES.DASHBOARD);
      }
      return null;
    }
  };
}
