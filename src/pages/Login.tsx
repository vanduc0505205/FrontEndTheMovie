import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/api/auth.api";
import { getUserById } from "@/api/user.api";
import { setLoginAtNow } from "@/lib/auth";

const { Title, Text } = Typography;

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  type LoginForm = { email: string; password: string };

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      const res = await login(values.email, values.password);
      if (res?.accessToken && res?.user) {
        localStorage.setItem("accessToken", res.accessToken);
        if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);
        setLoginAtNow();
        let finalUser: any = res.user;
        try {
          const id = res.user._id || res.user.id;
          if (id) {
            const freshUser = await getUserById(id);
            if (freshUser) {
              finalUser = freshUser;
              localStorage.setItem("user", JSON.stringify(freshUser));
            } else {
              localStorage.setItem("user", JSON.stringify(res.user));
            }
          } else {
            localStorage.setItem("user", JSON.stringify(res.user));
          }
        } catch {
          localStorage.setItem("user", JSON.stringify(res.user));
        }
        window.dispatchEvent(new Event("login-success"));
      }
      message.success(res?.message || "Đăng nhập thành công!");
      form.resetFields();
      try {
        const stored = localStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : undefined;
        const role = user?.role || res?.user?.role;
        if (role === "admin") navigate("/admin");
        else if (role === "staff") navigate("/staff");
        else navigate("/");
      } catch {
        navigate("/");
      }
    } catch (error: any) {
      const msg = error?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-40 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div 
          className={`w-full max-w-6xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            
            <div className="relative hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50"></div>
              
              <div className="absolute top-8 left-8 w-16 h-16 border-4 border-yellow-400 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
              
              <div className="absolute bottom-8 right-8 w-12 h-12 border-3 border-red-400 rotate-45 animate-pulse"></div>
              
              <div className="relative text-center text-white space-y-6">
                <div className="text-6xl mb-4 animate-bounce">🎬</div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  Alpha Cinema
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Trải nghiệm điện ảnh đỉnh cao<br />
                  Đặt vé nhanh chóng, xem phim thỏa thích
                </p>
                
                <div className="flex justify-center space-x-4 mt-8">
                  <div className="w-3 h-16 bg-gradient-to-t from-red-500 to-yellow-500 rounded animate-pulse"></div>
                  <div className="w-3 h-20 bg-gradient-to-t from-blue-500 to-purple-500 rounded animate-pulse animation-delay-1000"></div>
                  <div className="w-3 h-12 bg-gradient-to-t from-green-500 to-blue-500 rounded animate-pulse animation-delay-2000"></div>
                  <div className="w-3 h-18 bg-gradient-to-t from-pink-500 to-red-500 rounded animate-pulse animation-delay-3000"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md space-y-8">
                
                <div className="text-center space-y-2">
                  <div className="lg:hidden text-4xl mb-4">🎬</div>
                  <Title level={2} className="text-white font-bold">
                    <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                      Đăng Nhập
                    </span>
                  </Title>
                  <Text className="text-gray-300 text-lg">
                    Chào mừng trở lại Alpha Cinema
                  </Text>
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-6">
                  <Form.Item
                    label={<span className="text-white font-medium">Email</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input 
                      size="large" 
                      placeholder="example@gmail.com"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20 focus:bg-white/20 backdrop-blur-sm"
                      style={{
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '16px'
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-white font-medium">Mật khẩu</span>}
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                  >
                    <Input.Password 
                      size="large" 
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20 focus:bg-white/20 backdrop-blur-sm"
                      style={{
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '16px'
                      }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                      className="h-14 text-lg font-semibold border-0 hover:scale-105 transform transition-all duration-200"
                      style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Đang đăng nhập...
                        </span>
                      ) : (
                        "🎬 Đăng nhập ngay"
                      )}
                    </Button>
                  </Form.Item>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-gray-400">Hoặc</span>
                    </div>
                  </div>

                  <Form.Item>
                    <Button
                      block
                      size="large"
                      className="h-14 text-lg border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover:scale-105 transform transition-all duration-200"
                      style={{
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onClick={() => {
                        window.location.href = "http://localhost:3000/auth/google";
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <img 
                          src="https://developers.google.com/identity/images/g-logo.png" 
                          alt="google" 
                          className="w-6 h-6 mr-3" 
                        />
                        Đăng nhập bằng Google
                      </div>
                    </Button>
                  </Form.Item>

                  <div className="text-center space-y-4">
                    <Link to="/forgot-password" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 hover:underline text-sm">
                      🔐 Quên mật khẩu?
                    </Link>
                    
                    <div>
                      <Text className="text-gray-300">
                        Chưa có tài khoản?{" "}
                        <Link to="/dang-ky" className="text-pink-400 hover:text-pink-300 transition-colors duration-200 hover:underline font-medium">
                          Đăng ký ngay 🚀
                        </Link>
                      </Text>
                    </div>
                  </div>
                </Form>

                <div className="flex justify-center space-x-2 mt-8">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse animation-delay-500"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        /* Custom input styles */
        .ant-input, .ant-input-password {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }
        
        .ant-input::placeholder {
          color: rgba(156, 163, 175, 0.8) !important;
        }
        
        .ant-input:hover, .ant-input:focus {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(245, 158, 11, 0.5) !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1) !important;
        }
        
        .ant-form-item-label > label {
          color: white !important;
        }
        
        /* Hide Ant Design's default focus styles */
        .ant-input-focused, .ant-input:focus {
          border-color: rgba(245, 158, 11, 0.5) !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;