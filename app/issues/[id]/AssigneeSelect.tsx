'use client';

import type { User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {Skeleton} from '@/app/components';

type AssigneeOption = Pick<User, 'id' | 'name' | 'email'>;

const AssigneeSelect = () => {
  // Radix Themes 1.1.2 supports this at runtime but omits it from the prop type.
  // @ts-expect-error placeholder is supported by the Select.Trigger implementation.
  const trigger = <Select.Trigger placeholder='Assign...' />;

  const {
    data: users = [],
    error,
    isLoading,
  } = useQuery<AssigneeOption[], Error>(
    ['users'],
    async () => {
      const { data } = await axios.get<AssigneeOption[]>('/api/users');
      return data;
    },
    { staleTime: 60_000, retry: 3 }
  );

  if (isLoading) return <Skeleton />;

  if (error) return null;

  return (
    <Select.Root>
        {trigger}
        <Select.Content>
            <Select.Group>
                <Select.Label>Suggestions</Select.Label>
                {isLoading && <Select.Item value="loading" disabled>Loading users...</Select.Item>}
                {error && <Select.Item value="error" disabled>Unable to load users.</Select.Item>}
                {!isLoading && !error && users.length === 0 && (
                  <Select.Item value="empty" disabled>No users available.</Select.Item>
                )}
                {users.map(user => (
                  <Select.Item key={user.id} value={user.id}>
                    {user.name ?? user.email ?? 'Unnamed user'}
                  </Select.Item>
                ))}
            </Select.Group>
        </Select.Content>
    </Select.Root>
  )
}

export default AssigneeSelect
