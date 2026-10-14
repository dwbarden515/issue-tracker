import { Skeleton } from '@/app/components'
import { Flex, Table } from '@radix-ui/themes'
import IssueActions from './IssueActions'

const LoadingIssuesPage = () => {
  const rows = [1, 2, 3, 4, 5]

  return (
    <div>
      <IssueActions />
      <Table.Root variant='surface'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className='hidden md:table-cell'>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className='hidden md:table-cell'>Created</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row}>
              <Table.Cell>
                <Skeleton />
                <div className='block md:hidden'>
                  <Skeleton />
                </div>
              </Table.Cell>
              <Table.Cell className='hidden md:table-cell'>
                <Skeleton />
              </Table.Cell>
              <Table.Cell className='hidden md:table-cell'>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex align="center" gap="2" className="pt-8">
        <Skeleton width={90} />
        <Skeleton width={32} height={32} />
        <Skeleton width={32} height={32} />
        <Skeleton width={32} height={32} />
        <Skeleton width={32} height={32} />
      </Flex>
    </div>
  )
}

export default LoadingIssuesPage
