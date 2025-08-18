import { verifyVnPayPayment } from '@/api/payment.api';
import { Result, Button, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const CheckPayment = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'error' | 'success' | 'info'>('info');
  const [paymentStatus, setPaymentStatus] = useState({
    title: 'Đang xử lý thanh toán...',
    message: 'Vui lòng chờ trong giây lát',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkPayment = async () => {
      try {
        // Show loading state
        setStatus('info');
        setPaymentStatus({
          title: 'Đang xác thực thanh toán...',
          message: 'Vui lòng chờ trong giây lát',
        });

        // Convert URLSearchParams to object
        const params = Object.fromEntries(searchParams.entries());

        // Make the API call
        const { data } = await verifyVnPayPayment(params);

        if (data.success) {
          setStatus('success');
          setPaymentStatus({
            title: 'Thanh toán thành công!',
            message: `Mã giao dịch: ${data.data.vnp_TransactionNo || 'N/A'}`,
          });

          // Show success message
          message.success('Thanh toán của bạn đã được xử lý thành công');

          // Redirect to home after 5 seconds
          setTimeout(() => {
            navigate('/');
          }, 5000);
        } else {
          setStatus('error');
          setPaymentStatus({
            title: 'Thanh toán không thành công',
            message: data.message || 'Đã xảy ra lỗi khi xử lý thanh toán',
          });

          // Show error message
          message.error(data.message || 'Có lỗi xảy ra khi xử lý thanh toán');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('error');

        let errorMessage = 'Đã xảy ra lỗi khi xác thực thanh toán';

        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;
        } else if (error.request) {
          errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
        }

        setPaymentStatus({
          title: 'Lỗi xác thực',
          message: errorMessage,
        });

        message.error(errorMessage);
      }
    };

    checkPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <Result
          status={status}
          title={paymentStatus.title}
          subTitle={paymentStatus.message}
          extra={[
            <Button
              type="primary"
              key="home"
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Quay lại trang chủ
            </Button>,
            status !== 'info' && (
              <Button
                key="history"
                onClick={() => navigate('/lichsudatve')}
                className="ml-4"
              >
                Xem lịch sử giao dịch
              </Button>
            )
          ].filter(Boolean)}
        />
        {status === 'info' && (
          <div className="text-center mt-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckPayment