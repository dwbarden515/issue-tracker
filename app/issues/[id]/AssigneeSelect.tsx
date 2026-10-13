'use client';

import type { User } from '@prisma/client';
import { Select, Text } from '@radix-ui/themes';
import axios from 'axios';
import { useEffect, useState } from 'react';

type AssigneeOption = Pick<User, 'id' | 'name' | 'email'>;

const AssigneeSelect = () => {
  // Radix Themes 1.1.2 supports this at runtime but omits it from the prop type.
  // @ts-expect-error placeholder is supported by the Select.Trigger implementation.
  const trigger = <Select.Trigger placeholder='Assign...' />;

  const [users, setUsers] = useState<AssigneeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get<AssigneeOption[]>('/api/users');
        if (isCurrent) setUsers(data);
      } catch {
        if (isCurrent) setError('Unable to load users.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    fetchUsers();
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <Select.Root>
        {trigger}
        <Select.Content>
            <Select.Group>
                <Select.Label>Suggestions</Select.Label>
                {isLoading && <Select.Item value="loading" disabled>Loading users...</Select.Item>}
                {error && <Select.Item value="error" disabled>{error}</Select.Item>}
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
