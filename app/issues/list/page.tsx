import { IssueStatusBadge, Link } from '@/app/components';
import Pagination from '@/app/components/Pagination';
import prisma from '@/prisma/client';
import { Status } from '@prisma/client';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { Table } from "@radix-ui/themes";
import { Metadata } from 'next';
import NextLink from 'next/link';
import IssueActions from './IssueActions';

const columns: {
  label: string;
  value: 'title' | 'status' | 'createdAt';
  className?: string;
}[] = [
    { label: 'Issue', value: 'title' },
    { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
    { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
  ];

const sortableFields = columns.map(({ value }) => value);

const IssuesPage = async ({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) => {
  const params = await searchParams;
  const statusValue = typeof params.status === 'string' ? params.status : undefined;
  const status = Object.values(Status).find((value) => value === statusValue);
  const requestedOrderBy = typeof params.orderBy === 'string' ? params.orderBy : undefined;
  const orderBy = sortableFields.find((field) => field === requestedOrderBy) ?? 'createdAt';
  const requestedOrder = typeof params.order === 'string' ? params.order : undefined;
  const order = requestedOrder === 'desc' ? 'desc' : 'asc';
  const requestedPage = typeof params.page === 'string' ? Number(params.page) : 1;
  const pageSize = 5;
  const where = status ? { status } : undefined;
  const itemCount = await prisma.issue.count({ where });
  const pageCount = Math.max(1, Math.ceil(itemCount / pageSize));
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, pageCount)
    : 1;

  const issues = await prisma.issue.findMany({
    where,
    orderBy: { [orderBy]: order },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div>
      <IssueActions />
      <Table.Root variant='surface'>
        <Table.Header>
          <Table.Row>
            {columns.map(column => (
              <Table.ColumnHeaderCell key={column.value} className={column.className}>
                <NextLink href={(() => {
                  const query = new URLSearchParams();
                  Object.entries(params).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                      value.forEach((entry) => query.append(key, entry));
                    } else if (value !== undefined) {
                      query.set(key, value);
                    }
                  });

                  query.set('orderBy', column.value);
                  query.set('order', orderBy === column.value && order === 'asc' ? 'desc' : 'asc');

                  return `/issues/list?${query.toString()}`;
                })()}>
                  <span className="inline-flex items-center gap-1">
                    {column.label}
                    {orderBy === column.value && (
                      order === 'asc'
                        ? <ArrowUpIcon aria-hidden="true" />
                        : <ArrowDownIcon aria-hidden="true" />
                    )}
                  </span>
                </NextLink>
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>
                  {issue.title}
                </Link>
                <div className='block md:hidden'>
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className='hidden md:table-cell'>
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className='hidden md:table-cell'>{issue.createdAt.toDateString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        itemCount={itemCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  )
}

export const dynamic = 'force-dynamic';

export default IssuesPage

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all project issues'
}