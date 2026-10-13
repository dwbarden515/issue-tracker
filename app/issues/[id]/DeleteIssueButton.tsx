'use client';

import { AlertDialog, Button, Flex } from '@radix-ui/themes'

const DeleteIssueButton = ({issueId}: {issueId: number}) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
      <Button color="red">Delete Issue</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
        <AlertDialog.Description>
          Please delete this issue - I need a day off.
        </AlertDialog.Description>
        <Flex mt='4' gap='3'>
          <AlertDialog.Cancel>
            <Button variant='soft' color="gray">Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button color="red">Delete Issue</Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default DeleteIssueButton
