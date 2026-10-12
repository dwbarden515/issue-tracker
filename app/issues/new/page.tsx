'use client';

import { Button, Callout, TextFieldInput, TextFieldRoot } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface IssueForm { 
  title: string;
  description: string;
}

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const NewIssuePage = () => {
  const router = useRouter();
  const {register, control, handleSubmit} = useForm<IssueForm>();
  const [error, setError] = useState('');

  return (
    <div className='max-w-xl'>
      {error && <Callout.Root color="red" className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
      </Callout.Root>
      }
    
    <form 
      className='space-y-3' 
      onSubmit={handleSubmit(async (data) => {
        try {
          await axios.post('/api/issues', data);
          router.push('/issues');
        } catch (error) {
          setError('Failed to create issue. Please try again.');
        }

       
      })}>
        <TextFieldRoot>
            <TextFieldInput placeholder="Title" {...register('title')} />
        </TextFieldRoot>

        <Controller 
          name="description"
          control={control}
          render={({ field }) => <SimpleMDE {...field} placeholder="Description" />}
        />

        <Button>Submit New Issue</Button>
    </form>
  </div>
  )
}

export default NewIssuePage
