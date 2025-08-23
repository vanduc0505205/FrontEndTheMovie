import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUserFromLocalStorage, clearUserData } from "@/lib/auth";
import { changePassword } from "@/api/auth.api";

export default function ChangePasswordPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const user = getUserFromLocalStorage();
    const userId = user?.id || user?._id;

    const onFinish = async (values: any) => {
        if (!userId) {
            message.error("Bạn cần đăng nhập để đổi mật khẩu");
            navigate("/dang-nhap");
            return;
        }

        const { currentPassword, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
            message.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return;
        }

        setLoading(true);
        try {
            const data = await changePassword(userId, currentPassword, newPassword);
            message.success(data.message || "Đổi mật khẩu thành công!");
            clearUserData();
            form.resetFields();
            message.info("Vui lòng đăng nhập lại với mật khẩu mới");
            navigate("/dang-nhap");
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error?.message ||
                "Có lỗi xảy ra";
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Đổi mật khẩu
                </h1>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="space-y-4"
                >
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                    >
                        <Input.Password
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới" },
                            { min: 6, message: "Mật khẩu mới ít nhất 6 ký tự" },
                        ]}
                    >
                        <Input.Password
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu mới" }]}
                    >
                        <Input.Password
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<KeyOutlined />}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
