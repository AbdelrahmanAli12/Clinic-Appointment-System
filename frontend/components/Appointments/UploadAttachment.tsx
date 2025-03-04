import { useState, useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { GlobalUserRoleEnum } from '@/utils/constants';
import { openNotification, upload } from '@/utils';
import { withRoles } from '@/lib/WithRoles';

const UploadAttachment = (props: {
  id: string;
  currentAttachments: [any];
  role: string;
  setModelUpdated: (e: any) => void;
}) => {
  const { id, currentAttachments, role } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [size, setSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let fileSize = 0;
    currentAttachments?.forEach((element) => {
      fileSize += element.size;
    });
    setSize(fileSize);
  }, [currentAttachments]);

  const onFinish = async () => {
    if (!selectedFile) {
      return;
    }
    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const base64Data = event.target.result as string;
        const body = {
          _id: id,
          attachments: [
            {
              data: base64Data,
              contentType: selectedFile.type,
              filename: selectedFile.name,
              size: selectedFile.size,
            },
          ],
        };
        await upload(body);
        setIsModalOpen(false);
        props.setModelUpdated(new Date().getTime());
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      return openNotification({
        type: 'error',
        message: `API:Failure`,
      });
    } finally {
      setLoading(false);
    }
  };

  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const selected = target.files[0];
    setSelectedFile(selected);
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        icon={<UploadOutlined />}
        type='primary'
        className='bg-primary'
        disabled={size > 10 * 1024 * 1024}
      >
        Upload
      </Button>
      <Modal
        title='Upload Attachment'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width='30vw'
        className='max-w-lg'
        centered
      >
        <Form style={{ maxWidth: 600 }} onFinish={onFinish}>
          <Form.Item>
            <Input type='file' name='attachment' onChange={handleOnChange} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className='bg-primary'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default withRoles(UploadAttachment, [
  GlobalUserRoleEnum.ADMIN,
  GlobalUserRoleEnum.SCHEDULER,
  GlobalUserRoleEnum.HEALTHCAREUSER,
]);
