import { verifyVnPayPayment, checkPaymentStatus } from '@/api/payment.api';
import { Result, Button, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const CheckPayment = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
        setStatus('info');
        setPaymentStatus({
          title: 'Đang xác thực thanh toán...',
          message: 'Vui lòng chờ trong giây lát',
        });

        const params = Object.fromEntries(searchParams.entries());
        const hasVnpParams = Object.keys(params).some((k) => k.startsWith('vnp_'));
        const redirectCode = params.code as string | undefined;
        const redirectMessage = params.message as string | undefined;
        const bookingId = (params.bookingId as string) || (params.vnp_TxnRef as string);

        let resultCode: string | undefined = undefined;
        let resultMessage: string | undefined = undefined;

        if (hasVnpParams) {
          const { data } = await verifyVnPayPayment(params);
          resultCode = data?.code || (data?.success ? 'success' : 'payment_failed');
          resultMessage = data?.message;
        } else if (redirectCode) {
          resultCode = redirectCode;
          resultMessage = redirectMessage;
        }

        if (bookingId) {
          try {
            const { data: check } = await checkPaymentStatus(bookingId);
            if (check?.code === 'success' || check?.status === 'paid') {
              resultCode = 'success';
            } else if (check?.code === 'user_cancelled' || check?.status === 'cancelled') {
              resultCode = 'user_cancelled';
            } else {
              if (!resultCode || resultCode === 'success') resultCode = 'payment_failed';
            }
          } catch (_) {
          }
        }

        if (resultCode === 'success') {
          setStatus('success');
          setPaymentStatus({
            title: 'Thanh toán thành công!',
            message: `${resultMessage || 'Giao dịch thành công'}${bookingId ? ` | Booking ID: ${bookingId}` : ''}`,
          });
          message.success('Thanh toán của bạn đã được xử lý thành công');
          return;
        }

        if (resultCode === 'showtime_cancelled') {
          setStatus('error');
          setPaymentStatus({
            title: 'Suất chiếu đã bị hủy',
            message: resultMessage || 'Giao dịch không thể hoàn tất vì suất chiếu đã bị hủy. Vui lòng chọn suất khác.',
          });
          message.warning('Suất chiếu đã bị hủy. Vui lòng chọn suất khác.');
          return;
        }

        if (resultCode === 'user_cancelled') {
          throw new Error(resultMessage || 'Bạn đã hủy thanh toán');
        }
        throw new Error(resultMessage || 'Thanh toán không thành công');

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
    <div className="py-20 min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Movie theater background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `repeating-linear-gradient(
                 90deg,
                 transparent,
                 transparent 15px,
                 rgba(255,255,255,0.1) 15px,
                 rgba(255,255,255,0.1) 16px
               )`
             }}>
        </div>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Movie ticket style card */}
        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
          {/* Header với màu đỏ cinema */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-center relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gray-900 rounded-r-full"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gray-900 rounded-l-full"></div>
            
            <div className="flex items-center justify-center space-x-3 text-white">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">CINEMA TICKET</h2>
            </div>
          </div>

          {/* Ticket perforation */}
          <div className="relative">
            <div className="absolute left-0 top-0 w-full h-0 border-t-2 border-dashed border-gray-300 transform translate-y-0"></div>
            <div className="flex justify-between absolute -top-4 left-0 right-0 px-2">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full border-2 border-gray-300"></div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="px-8 py-12 text-center">
            {/* Status display */}
            <div className="mb-8">
              {status === 'info' && (
                <div className="mx-auto w-20 h-20 relative mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-400">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {status === 'error' && (
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-red-400">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Status text */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {paymentStatus.title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {paymentStatus.message}
              </p>
            </div>

            {/* Ticket details section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 font-medium">Trạng thái:</span>
                  <div className={`inline-block ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'success' ? 'bg-green-100 text-green-800' :
                    status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {status === 'success' ? 'Thành công' : status === 'error' ? 'Thất bại' : 'Đang xử lý'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Thời gian:</span>
                  <div className="text-gray-800 font-medium ml-2">
                    {new Date().toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons outside ticket */}
        {status !== 'info' && (
          <div className="bg-white rounded-b-3xl shadow-2xl px-8 py-6 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Về trang chủ</span>
            </button>
            
            <button
              onClick={() => navigate('/lichsudatve')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl border-2 border-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Lịch sử giao dịch</span>
            </button>
          </div>
        )}
      </div>

      {/* Movie film strip decoration */}
      <div className="absolute left-0 top-0 w-8 h-full bg-gray-800 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-6 h-6 bg-gray-900 mx-1 mb-2 rounded" style={{marginTop: i === 0 ? '1rem' : '0'}}></div>
        ))}
      </div>
      <div className="absolute right-0 top-0 w-8 h-full bg-gray-800 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-6 h-6 bg-gray-900 mx-1 mb-2 rounded" style={{marginTop: i === 0 ? '1rem' : '0'}}></div>
        ))}
      </div>
    </div>
  );
}

export default CheckPayment;