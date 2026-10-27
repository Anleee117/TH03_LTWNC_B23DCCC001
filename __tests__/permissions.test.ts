import { can } from '@/lib/permissions';

describe('Permissions can() matrix', () => {
  test('guest permissions', () => {
    expect(can('guest', 'view')).toBe(true);
    expect(can('guest', 'mark_complete')).toBe(false);
    expect(can('guest', 'create')).toBe(false);
    expect(can('guest', 'delete')).toBe(false);

    expect(can(null, 'view')).toBe(true);
    expect(can(null, 'mark_complete')).toBe(false);
    expect(can(null, 'create')).toBe(false);
    expect(can(null, 'delete')).toBe(false);

    expect(can(undefined, 'view')).toBe(true);
    expect(can(undefined, 'mark_complete')).toBe(false);
    expect(can(undefined, 'create')).toBe(false);
    expect(can(undefined, 'delete')).toBe(false);
  });

  test('user permissions', () => {
    expect(can('user', 'view')).toBe(true);
    expect(can('user', 'mark_complete')).toBe(true);
    expect(can('user', 'create')).toBe(false);
    expect(can('user', 'delete')).toBe(false);
  });

  test('admin permissions', () => {
    expect(can('admin', 'view')).toBe(true);
    expect(can('admin', 'mark_complete')).toBe(true);
    expect(can('admin', 'create')).toBe(true);
    expect(can('admin', 'delete')).toBe(true);
  });
});
