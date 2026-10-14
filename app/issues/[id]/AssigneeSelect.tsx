'use client';

import type { User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/app/components';
import toast, { Toaster } from 'react-hot-toast';

type AssigneeOption = Pick<User, 'id' | 'name' | 'email'>;
const UNASSIGNED_VALUE = '__unassigned__';

interface Props {
  issueId: number;
  assignedToUserId: string | null;
}

const AssigneeSelect = ({ issueId, assignedToUserId }: Props) => {
  const router = useRouter();
  const [selectedAssignee, setSelectedAssignee] = useState(
    assignedToUserId ?? UNASSIGNED_VALUE
  );

  useEffect(() => {
    setSelectedAssignee(assignedToUserId ?? UNASSIGNED_VALUE);
  }, [assignedToUserId]);

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

  const updateAssignee = useMutation(
    (userId: string) => axios.patch(`/api/issues/${issueId}`, {
      assignedToUserId: userId === UNASSIGNED_VALUE ? null : userId,
    }),
    { onSuccess: () => router.refresh() }
  );

  if (isLoading) return <Skeleton />;

  if (error) return null;

  return (
    <>
      <Select.Root
        value={selectedAssignee}
        onValueChange={(userId) => {
          setSelectedAssignee(userId);
          updateAssignee.mutate(userId, {
            onError: (error: unknown) => {
              setSelectedAssignee(assignedToUserId ?? UNASSIGNED_VALUE);
              const message = axios.isAxiosError<{ error?: string }>(error)
                ? error.response?.data?.error
                : undefined;
              toast.error(message ?? 'Unable to update the assignee. Please try again.');
            },
          });
        }}
        disabled={updateAssignee.isLoading}
      >
        {trigger}
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value={UNASSIGNED_VALUE}>Unassigned</Select.Item>
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
      <Toaster />
    </>
  )
}

export default AssigneeSelect
