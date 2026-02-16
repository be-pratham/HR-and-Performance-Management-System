import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    title: 'My Goals',
    path: '/goals',
    icon: <TrackChangesIcon />,
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    title: 'Team Approvals',
    path: '/approvals',
    icon: <CheckCircleIcon />,
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    title: 'Feedback & Reviews',
    path: '/feedback',
    icon: <RateReviewIcon />,
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    title: 'Learning',
    path: '/learning',
    icon: <SchoolIcon />,
    allowedRoles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
    allowedRoles: [ROLES.ADMIN],
  },
];