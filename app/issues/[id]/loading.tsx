import {Skeleton} from '@/app/components';

const LoadingIssueDetailPage = () => {
  return (
    <div className='max-w-xl space-y-3'>
      <Skeleton height={32} width='60%' />
      <Skeleton count={3} />
      <Skeleton height={24} width='25%' />
      <Skeleton width='40%' />
    </div>
  )
}

export default LoadingIssueDetailPage
