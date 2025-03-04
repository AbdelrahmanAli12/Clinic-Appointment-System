import { withRoles } from '@/lib/WithRoles';
import { openNotification } from '@/utils';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { CommentOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface AddNotesProps {
  id: string;
  preParsedNote: string;
  setPageLoading: (flag: boolean) => void;
  setModelUpdated: (e: any) => void;
}

const AddNotes = (props: AddNotesProps) => {
  const { id, preParsedNote, setPageLoading, setModelUpdated } = props;
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setNotes(preParsedNote);
  }, [preParsedNote]);

  async function submitComments() {
    try {
      setPageLoading(true);
      setIsModalOpen(false);
      const reqBody = {
        _id: id,
        appointmentNotes: notes,
      };
      const addNotesResponse = await fetch('/api/appointments', {
        method: 'PUT',
        body: JSON.stringify(reqBody),
      });

      const result = await addNotesResponse.json();
      openNotification({
        type: addNotesResponse.ok ? 'success' : 'error',
        message:
          result.data.message ??
          (addNotesResponse.ok ? 'Comment added successfully' : 'Failed to add comments'),
      });
      if (addNotesResponse.ok) {
        setModelUpdated(new Date().getTime());
      }
    } catch (error) {
      openNotification({
        type: 'error',
        message: `API Failed to add comment ${error}`,
      });
    } finally {
      setPageLoading(false);
    }
  }

  return (
    <>
      <Button type='primary' onClick={() => setIsModalOpen(true)} icon={<CommentOutlined />}>
        Add notes and comments
      </Button>

      <Modal
        title='Add notes and comments'
        width='90vw'
        open={isModalOpen}
        className='max-w-[1040px]'
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            type='primary'
            key='cancel'
            onClick={() => setIsModalOpen(false)}
            className='mt-10'
          >
            Cancel
          </Button>,
          <Button type='primary' key='submit' onClick={() => submitComments()} className='mt-10'>
            Submit
          </Button>,
        ]}
      >
        <ReactQuill
          theme='snow'
          value={notes}
          onChange={setNotes}
          className='mt-5 mb-5 h-[500px]'
        />
      </Modal>
    </>
  );
};

export default withRoles(AddNotes, [
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
