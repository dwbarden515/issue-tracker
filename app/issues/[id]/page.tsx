import { auth } from '@/auth'
import prisma from '@/prisma/client'
import { Box, Flex, Grid } from '@radix-ui/themes'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AssigneeSelect from './AssigneeSelect'
import DeleteIssueButton from './DeleteIssueButton'
import EditIssueButton from './EditIssueButton'
import IssueDetails from './IssueDetails'

interface Props {
  params: Promise<{
    id: string
  }>
}

const IssueDetailPage = async ({ params }: Props) => {

  const { id } = await params
  const issue = await prisma.issue.findUnique({
    where: {
      id: parseInt(id)
    }
  })

  if (!issue)
    notFound();

  const session = await auth()

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className='md:col-span-4'>
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect
              issueId={issue.id}
              assignedToUserId={issue.assignedToUserId}
            />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  )
}

export default IssueDetailPage

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const issueId = Number(id);

  if (!Number.isInteger(issueId) || issueId <= 0) {
    return {
      title: 'Issue not found',
      description: 'The requested issue could not be found.',
    };
  }

  const issue = await prisma.issue.findUnique({ where: { id: issueId } });

  return {
    title: issue?.title ?? 'Issue not found',
    description: issue
      ? `Details of issue ${issue.id}`
      : 'The requested issue could not be found.',
  };
}