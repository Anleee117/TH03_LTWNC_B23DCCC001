import { Action, Role, UserRole } from '@/types';

const PERMISSION_MATRIX: Record<Action, Record<Role, boolean>> = {
  view: {
    guest: true,
    user: true,
    admin: true
  },
  mark_complete: {
    guest: false,
    user: true,
    admin: true
  },
  create: {
    guest: false,
    user: false,
    admin: true
  },
  delete: {
    guest: false,
    user: false,
    admin: true
  }
};

export function can(role: Role | UserRole | null | undefined, action: Action): boolean {
  const normalizedRole: Role = role ? role : 'guest';
  return PERMISSION_MATRIX[action][normalizedRole] === true;
}
