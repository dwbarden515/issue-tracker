'use client';

import { Select } from '@radix-ui/themes';

const AssigneeSelect = () => {
  // Radix Themes 1.1.2 supports this at runtime but omits it from the prop type.
  // @ts-expect-error placeholder is supported by the Select.Trigger implementation.
  const trigger = <Select.Trigger placeholder='Assign...' />;

  return (
    <Select.Root>
        {trigger}
        <Select.Content>
            <Select.Group>
                <Select.Label>Suggestions</Select.Label>
                <Select.Item value="1">Dave Barden</Select.Item>
            </Select.Group>
        </Select.Content>
    </Select.Root>
  )
}

export default AssigneeSelect
