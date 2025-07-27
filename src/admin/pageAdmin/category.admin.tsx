// pages/admin/CategoryAdmin.tsx
import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category.service';
import { ICategory } from '@/types/category';
import {
  Card,
  Input,
  Button,
  List,
  Form,
  Typography,
  Space,
  message,
} from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const list = await getCategories();
      setCategories(list);
    } catch (err) {
      console.error('Lỗi lấy danh sách danh mục:', err);
      message.error('Không thể lấy danh sách danh mục');
    }
  };

  const handleSubmit = async (values: { categoryName: string; description?: string }) => {
    if (!values.categoryName.trim()) {
      return message.warning('Tên danh mục không được để trống');
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateCategory(editingId, values);
        message.success('Cập nhật danh mục thành công');
      } else {
        await createCategory(values);
        message.success('Tạo danh mục mới thành công');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi submit:', err);
      message.error('Đã xảy ra lỗi khi lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: ICategory) => {
    form.setFieldsValue({
      categoryName: cat.categoryName,
      description: cat.description,
    });
    setEditingId(cat._id);
  };

  const handleDelete = async (id: string) => {
    try {
      if(confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
        await deleteCategory(id);
        message.success('Xóa danh mục thành công');
        fetchCategories();
      }
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      message.error('Không thể xóa danh mục');
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEditingId(null);
  };

  return (
    <Card title={<Title level={4}>Quản lý danh mục</Title>} style={{ maxWidth: 800, margin: '24px auto' }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên danh mục"
          name="categoryName"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input placeholder="Tên danh mục" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea placeholder="Mô tả danh mục (tuỳ chọn)" autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingId ? 'Cập nhật' : 'Thêm'}
            </Button>
            {editingId && (
              <Button onClick={resetForm} disabled={loading}>
                Hủy
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>

      <Title level={5}>Danh sách danh mục</Title>
      <List
         dataSource={categories || []}
        bordered
        locale={{ emptyText: 'Chưa có danh mục nào' }}
        renderItem={(cat) => (
          <List.Item
            actions={[
              <Button size="small" onClick={() => handleEdit(cat)}>Sửa</Button>,
              <Button size="small" danger onClick={() => handleDelete(cat._id)}>Xoá</Button>,
            ]}
          >
            <List.Item.Meta
              title={cat.categoryName}
              description={cat.description}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
