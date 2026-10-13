'use client';

import dynamic from 'next/dynamic';
import IssueFormSkeleton from './IssueFormSkeleton';
import type { Issue } from '@prisma/client';

const IssueForm = dynamic(() => import('./IssueForm'), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

const IssueFormLoader = ({ issue }: { issue: Issue }) => {
  return <IssueForm issue={issue} />;
};

export default IssueFormLoader;
