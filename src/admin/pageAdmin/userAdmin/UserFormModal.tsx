import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { IUser } from '@/types/user';

interface UserFormModalProps {
  visible: boolean;
  isEditMode: boolean;
  currentStaff: IUser | null;
  onCancel: () => void;
  onSubmit: (values: Partial<IUser>) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  isEditMode,
  currentStaff,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        username: currentStaff?.username || '',
        email: currentStaff?.email || '',
        password: '',
      });
    }
  }, [visible, currentStaff, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={visible}
      title={isEditMode ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEditMode ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input />
        </Form.Item>

        {!isEditMode && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserFormModal;
