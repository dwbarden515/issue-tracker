'use client';

import { Status } from '@prisma/client'
import { Select } from '@radix-ui/themes'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const ALL_STATUSES = 'ALL';

const statuses: { label: string, value: string }[] = [
    { label: 'All', value: ALL_STATUSES },
    { label: 'Open', value: 'OPEN'},
    { label: 'In Progress', value: 'IN_PROGRESS'},
    { label: 'Closed', value: 'CLOSED'}
]

const IssueStatusFilter = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedStatus = searchParams.get('status') ?? ALL_STATUSES;

  return (
    <Select.Root
      value={selectedStatus}
      onValueChange={(status) => {
        const query = new URLSearchParams(searchParams.toString());
        if (status === ALL_STATUSES) {
          query.delete('status');
        } else {
          query.set('status', status);
        }
        const queryString = query.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
      }}
    >
        {/* Radix Themes supports this prop at runtime, but its type omits it. */}
        {/* @ts-expect-error placeholder is supported by the Select.Trigger implementation. */}
        <Select.Trigger placeholder='Filter by status' />
        <Select.Content>
            {statuses.map(status => (
                <Select.Item key={status.value} value={status.value}>
                    {status.label}
                </Select.Item>
            ))}
        </Select.Content>
    </Select.Root>
  )
}

export default IssueStatusFilter
