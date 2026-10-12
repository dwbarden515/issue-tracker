'use client';

import { Button, Callout, TextFieldInput, TextFieldRoot, Text } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof createIssueSchema>;

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const NewIssuePage = () => {
  const router = useRouter();
  const {register, control, handleSubmit, formState: {errors}} = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema)
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = handleSubmit(async (data) => {
        try {
          setIsSubmitting(true);
          await axios.post('/api/issues', data);
          router.push('/issues');
        } catch (error) {
          setIsSubmitting(false);
          setError('Failed to create issue. Please try again.');
        }
    });
  
  return (
    <div className='max-w-xl'>
      {error && <Callout.Root color="red" className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
      </Callout.Root>
      }
    
    <form 
      className='space-y-3' 
      onSubmit={onSubmit}
      >
        <TextFieldRoot>
            <TextFieldInput placeholder="Title" {...register('title')} />
        </TextFieldRoot>
          <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller 
          name="description"
          control={control}
          render={({ field }) => <SimpleMDE {...field} placeholder="Description" />}
        />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : 'Submit New Issue'}
        </Button>
      </form>
    </div>
  )
}

export default NewIssuePage
