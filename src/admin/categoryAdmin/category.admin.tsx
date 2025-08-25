import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/category.api';
import {
  Card,
  Input,
  Button,
  List,
  Form,
  Typography,
  Space,
  message,
  Popconfirm,
} from 'antd';
import { ICategory } from '@/interface/category';

const { TextArea } = Input;
const { Title } = Typography;

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role;

  useEffect(() => {
    fetchCategories();
  }, []);

  const sortCategories = (list: ICategory[]) => {
    return [...list].sort((a: any, b: any) => {
      const at = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (at !== bt) return bt - at;
      return (b?._id || '').localeCompare(a?._id || '');
    });
  };

  const fetchCategories = async () => {
    try {
      const list = await getCategories();
      const sorted = sortCategories(list);
      setCategories(sorted);
      const maxPage = Math.max(1, Math.ceil(sorted.length / pageSize));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    } catch (err) {
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
    await fetchCategories();
    setCurrentPage(1);
  } catch (err: any) {
    const messages = err?.response?.data?.message;

    if (Array.isArray(messages)) {
      const nameError = messages.find((msg: string) =>
        msg.toLowerCase().includes('tên thể loại')
      );
      if (nameError) {
        form.setFields([
          {
            name: 'categoryName',
            errors: [nameError],
          },
        ]);
      }
    } else {
      message.error('Đã xảy ra lỗi khi lưu danh mục');
    }
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
      await deleteCategory(id);
      message.success('Xóa danh mục thành công');
      const newList = categories.filter((c) => c._id !== id);
      const maxPage = Math.max(1, Math.ceil(newList.length / pageSize));
      if (currentPage > maxPage) setCurrentPage(maxPage);
      await fetchCategories();
    } catch (err) {
      message.error('Không thể xóa danh mục');
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEditingId(null);
  };

  return (
    <Card
      title={<Title level={4}>Quản lý danh mục</Title>}
      style={{ maxWidth: 800, margin: '24px auto' }}
    >
      {userRole === 'admin' && (
        <>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Tên danh mục"
              name="categoryName"
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
            >
              <Input placeholder="Tên danh mục" />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <TextArea
                placeholder="Mô tả danh mục (tuỳ chọn)"
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
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
        </>
      )}

      <List
        dataSource={
          (categories || []).slice((currentPage - 1) * pageSize, currentPage * pageSize)
        }
        bordered
        locale={{ emptyText: 'Chưa có danh mục nào' }}
        pagination={{
          current: currentPage,
          pageSize,
          total: categories.length,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        renderItem={(cat) => (
          <List.Item
            actions={
              userRole === 'admin'
                ? [
                  <Button size="small" onClick={() => handleEdit(cat)}>Sửa</Button>,
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa danh mục này?"
                    onConfirm={() => handleDelete(cat._id)}
                    okText="Xoá"
                    cancelText="Huỷ"
                  >
                    <Button size="small" danger>Xoá</Button>
                  </Popconfirm>,
                ]
                : undefined
            }
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
