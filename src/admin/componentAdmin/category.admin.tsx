// pages/admin/CategoryAdmin.tsx
import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category.service';
import { Category } from '@/types/index';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ categoryName: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const list = await getCategories();
      console.log('Danh sách danh mục:', list);
      setCategories(list);
    } catch (err) {
      console.error('Lỗi lấy danh sách danh mục:', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.categoryName.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Lỗi submit:', err);
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({
      categoryName: cat.categoryName,
      description: cat.description,
    });
    setEditingId(cat._id);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    fetchCategories();
  };

  const resetForm = () => {
    setForm({ categoryName: '', description: '' });
    setEditingId(null);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục'}
        </h2>

        <div className="space-y-4 mb-6">
          <Input
            placeholder="Tên danh mục"
            value={form.categoryName}
            onChange={(e) =>
              setForm({ ...form, categoryName: e.target.value })
            }
          />
          <Textarea
            placeholder="Mô tả (tuỳ chọn)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              {editingId ? 'Cập nhật' : 'Thêm'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Hủy
              </Button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">Danh sách danh mục</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-start border-b py-2"
            >
              <div>
                <div className="font-medium">{cat.categoryName}</div>
                {cat.description && (
                  <div className="text-sm text-gray-600">{cat.description}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cat._id)}
                >
                  Xoá
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
