import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { IUser } from "@/interface/user";
import { updateProfile, getUserById } from "@/api/user.api";
import { getUserFromLocalStorage } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { KeyOutlined } from "@ant-design/icons";

export default function UserProfile() {
  const [form] = Form.useForm();
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = getUserFromLocalStorage();
        setUser(storedUser);
        const userId = storedUser?.id || storedUser?._id;
        if (!userId) return;
        const res = await getUserById(userId);
        const data: IUser = res;
        setUser(data);
        form.setFieldsValue({
          username: data.username,
          email: data.email,
        });
      } catch (error) {
        message.error("Không tải được thông tin user");
      }
    };

    fetchUser();
  }, [form]);

  const onFinish = async (values: Partial<IUser>) => {
    const userId = user?._id;
    if (!userId) return;

    try {
      // Gọi API cập nhật
      await updateProfile(userId, values);
      message.success("Cập nhật thành công!");

      // Fetch lại dữ liệu user từ backend
      const res = await getUserById(userId);
      const updatedUser: IUser = res;
      setUser(updatedUser);

      // Đồng bộ lại form với dữ liệu mới
      form.setFieldsValue({
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thông tin người dùng</h1>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-lg font-semibold text-gray-700">Tên hiển thị</span>}
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị" }]}
          >
            <Input
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              placeholder="Nhập tên hiển thị"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input
              disabled
              className={`rounded-lg border-gray-300 ${user?.googleId ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
              placeholder="Email của bạn"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex space-x-4">
              <Button
                type="primary"
                htmlType="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Lưu thay đổi
              </Button>
              {!user?.googleId && (
                <Button
                  type="default"
                  onClick={handleChangePassword}
                  icon={<KeyOutlined />}
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Đổi mật khẩu
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
