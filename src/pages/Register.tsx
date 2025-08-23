import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { IUser } from "@/interface/user";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: IUser) => {
    try {
      setLoading(true);
      const payload = {
        username: values.username?.trim(),
        email: values.email?.trim().toLowerCase(),
        password: values.password,
        role: "customer",
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("Đăng ký thành công! Mời bạn đăng nhập.");
        form.resetFields();
        navigate("/dang-nhap");
      } else {
        if (res.status === 409) {
          message.error("Email đã được sử dụng. Vui lòng dùng email khác.");
        } else {
          message.error(data.message || "Đăng ký thất bại.");
        }
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      message.error("Lỗi server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2s"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4s"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-float">🎬</div>
        <div className="absolute top-32 right-20 text-3xl opacity-10 animate-float animation-delay-1s">🍿</div>
        <div className="absolute bottom-40 left-32 text-4xl opacity-10 animate-float animation-delay-2s">🎭</div>
        <div className="absolute bottom-20 right-40 text-3xl opacity-10 animate-float animation-delay-3s">🎪</div>
        <div className="absolute top-1/2 right-10 text-2xl opacity-10 animate-float animation-delay-4s">🎫</div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[600px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0">
                  <div className="absolute top-10 left-10 text-6xl animate-float-slow opacity-30">🎭</div>
                  <div className="absolute top-32 right-16 text-4xl animate-float animation-delay-1s opacity-40">🍿</div>
                  <div className="absolute bottom-40 left-20 text-5xl animate-float-slow animation-delay-2s opacity-35">🎪</div>
                  <div className="absolute bottom-20 right-32 text-4xl animate-float animation-delay-3s opacity-30">🎫</div>
                  <div className="absolute top-1/2 left-8 text-3xl animate-float-slow animation-delay-4s opacity-25">🎵</div>
                </div>
                <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-b from-yellow-400 to-orange-500 opacity-20">
                  <div className="flex flex-col h-full justify-evenly">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-6 h-4 bg-black mx-1 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
                
                <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-b from-yellow-400 to-orange-500 opacity-20">
                  <div className="flex flex-col h-full justify-evenly">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-6 h-4 bg-black mx-1 animate-pulse" style={{ animationDelay: `${i * 0.2 + 1}s` }} />
                    ))}
                  </div>
                </div>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-radial from-yellow-300/30 to-transparent rounded-full animate-pulse-slow"></div>
              </div>
              
              <div className="absolute inset-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-4 border-yellow-400 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse-slow"></div>
                
                <div className="absolute inset-2 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan"></div>
                  
                  <div className="flex flex-col justify-center items-center h-full text-white p-4">
                    <div className="text-center space-y-4 animate-fade-in-up">
                      <div className="text-4xl lg:text-6xl animate-rotate-slow">🎬</div>
                      <h2 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        Chào mừng đến với
                      </h2>
                      <h1 className="text-xl lg:text-3xl font-extrabold text-white drop-shadow-lg">Alpha Cinema</h1>
                      <p className="text-sm lg:text-base opacity-90 max-w-xs leading-relaxed">
                        Trải nghiệm điện ảnh đỉnh cao với công nghệ hiện đại nhất
                      </p>
                      
                      <div className="mt-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse cursor-pointer hover:scale-110 transition-transform duration-300">
                          <div className="text-white text-xl lg:text-2xl ml-1">▶</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-60 h-20 bg-gradient-to-t from-yellow-400/30 to-transparent blur-xl"></div>
            </div>

            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-center mb-8 animate-slide-up">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <span className="text-4xl animate-spin-slow">🎥</span>
                  <Title level={2} className="!text-white !mb-0 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Đăng Ký
                  </Title>
                  <span className="text-4xl animate-spin-slow animation-delay-1s">🍿</span>
                </div>
                <Text className="text-gray-300 text-lg">
                  Tham gia cộng đồng yêu phim của chúng tôi
                </Text>
              </div>

              <Form 
                form={form} 
                layout="vertical" 
                onFinish={onFinish}
                className="space-y-2 animate-slide-up animation-delay-2s"
              >
                <Form.Item
                  label={<span className="text-white font-medium">Tên người dùng</span>}
                  name="username"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input 
                    size="large" 
                    placeholder="Tên của bạn"
                    className="!bg-white/10 !border-white/30 !text-white placeholder:text-gray-400 hover:!border-cyan-400 focus:!border-cyan-400 transition-all duration-300"
                    prefix={<span className="text-cyan-400">👤</span>}
                    autoComplete="username"
                  />
                </Form.Item>

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
                    className="!bg-white/10 !border-white/30 !text-white placeholder:text-gray-400 hover:!border-cyan-400 focus:!border-cyan-400 transition-all duration-300"
                    prefix={<span className="text-cyan-400">📧</span>}
                    type="email"
                    autoComplete="email"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white font-medium">Mật khẩu</span>}
                  name="password"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                  hasFeedback
                >
                  <Input.Password 
                    size="large" 
                    placeholder="******"
                    className="!bg-white/10 !border-white/30 !text-white placeholder:text-gray-400 hover:!border-cyan-400 focus:!border-cyan-400 transition-all duration-300"
                    prefix={<span className="text-cyan-400">🔒</span>}
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white font-medium">Xác nhận mật khẩu</span>}
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu không khớp"));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    size="large" 
                    placeholder="******"
                    className="!bg-white/10 !border-white/30 !text-white placeholder:text-gray-400 hover:!border-cyan-400 focus:!border-cyan-400 transition-all duration-300"
                    prefix={<span className="text-cyan-400">🔐</span>}
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item className="!mt-8">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading} 
                    block 
                    size="large"
                    className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !border-none !text-white !font-bold !text-lg !h-14 hover:!from-purple-600 hover:!to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Đang đăng ký...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        🚀 Đăng ký ngay
                      </span>
                    )}
                  </Button>
                </Form.Item>

                <div className="text-center space-y-4 mt-6">
                  <Text className="text-gray-300">
                    Đã có tài khoản?{" "}
                    <Link 
                      to="/dang-nhap" 
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
                    >
                      Đăng nhập ngay
                    </Link>
                  </Text>
                  <br />
                  <Link 
                    to="/forgot-password" 
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 inline-flex items-center gap-1"
                  >
                    <span>🔑</span>
                    Quên mật khẩu?
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-rotate-slow { animation: rotate-slow 10s linear infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-scan { animation: scan 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        .animation-delay-1s { animation-delay: 1s; }
        .animation-delay-2s { animation-delay: 2s; }
        .animation-delay-3s { animation-delay: 3s; }
        .animation-delay-4s { animation-delay: 4s; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
};

export default Register;