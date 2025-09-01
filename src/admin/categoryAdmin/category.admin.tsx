import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getDeletedCategories,
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
  const [showTrash, setShowTrash] = useState<boolean>(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role;

  useEffect(() => {
    fetchCategories();
  }, [showTrash]);

  const sortCategories = (list: ICategory[]) => {
    return [...list].sort((a: any, b: any) => {
      const at = a?.taoLuc ? new Date(a.taoLuc).getTime() : 0;
      const bt = b?.taoLuc ? new Date(b.taoLuc).getTime() : 0;
      if (at !== bt) return bt - at;
      return (b?._id || '').localeCompare(a?._id || '');
    });
  };

  const fetchCategories = async () => {
    try {
      const list = showTrash ? await getDeletedCategories() : await getCategories();
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

  const handleRestore = async (id: string) => {
    try {
      await restoreCategory(id);
      message.success('Khôi phục danh mục thành công');
      const newList = categories.filter((c) => c._id !== id);
      const maxPage = Math.max(1, Math.ceil(newList.length / pageSize));
      if (currentPage > maxPage) setCurrentPage(maxPage);
      await fetchCategories();
    } catch (err) {
      message.error('Không thể khôi phục danh mục');
    }
  };

  const handlePurge = async (id: string) => {
    try {
      const confirm2 = window.confirm('Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa vĩnh viễn?');
      if (!confirm2) return;
      const { purgeCategory } = await import('@/api/category.api');
      await purgeCategory(id);
      message.success('Đã xóa vĩnh viễn');
      const newList = categories.filter((c) => c._id !== id);
      const maxPage = Math.max(1, Math.ceil(newList.length / pageSize));
      if (currentPage > maxPage) setCurrentPage(maxPage);
      await fetchCategories();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể xóa vĩnh viễn';
      message.error(msg);
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
                <Button onClick={() => setShowTrash((v) => !v)}>
                  {showTrash ? 'Xem danh sách' : 'Xem thùng rác'}
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Title level={5}>{showTrash ? 'Thùng rác' : 'Danh sách danh mục'}</Title>
        </>
      )}

      {userRole !== 'admin' && <Title level={5}>{showTrash ? 'Thùng rác' : 'Danh sách danh mục'}</Title>}

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
                  !showTrash && (
                    <Button size="small" onClick={() => handleEdit(cat)}>Sửa</Button>
                  ),
                  !showTrash && (
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa danh mục này?"
                      onConfirm={() => handleDelete(cat._id)}
                      okText="Xoá"
                      cancelText="Huỷ"
                    >
                      <Button size="small" danger>Xoá</Button>
                    </Popconfirm>
                  ),
                  showTrash && (
                    <Button size="small" type="primary" onClick={() => handleRestore(cat._id)}>
                      Khôi phục
                    </Button>
                  ),
                  showTrash && (
                    <Popconfirm
                      title="Xóa vĩnh viễn danh mục này?"
                      description="Bạn sẽ KHÔNG thể khôi phục lại."
                      okText="Xóa vĩnh viễn"
                      okButtonProps={{ danger: true }}
                      cancelText="Hủy"
                      onConfirm={() => handlePurge(cat._id)}
                    >
                      <Button size="small" danger>
                        Xóa vĩnh viễn
                      </Button>
                    </Popconfirm>
                  ),
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
