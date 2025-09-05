import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import 'antd/dist/reset.css'
import '@/assets/css/index.css'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConfigProvider
        locale={viVN}
        form={{
          validateMessages: {
            default: 'Giá trị không hợp lệ',
            required: '${label} là bắt buộc!',
            enum: '${label} phải là một trong các giá trị: [${enum}]',
            whitespace: '${label} không được để trống',
            date: {
              format: '${label} không đúng định dạng ngày',
              parse: '${label} không thể phân tích ngày',
              invalid: '${label} không hợp lệ',
            },
            types: {
              string: '${label} không hợp lệ',
              method: '${label} không hợp lệ',
              array: '${label} phải là mảng',
              object: '${label} phải là đối tượng',
              number: '${label} phải là số',
              date: '${label} phải là ngày hợp lệ',
              boolean: '${label} phải là kiểu đúng/sai',
              integer: '${label} phải là số nguyên',
              float: '${label} phải là số thực',
              regexp: '${label} không đúng định dạng',
              email: '${label} không đúng định dạng email',
              url: '${label} không đúng định dạng URL',
              hex: '${label} phải là số hex',
            },
            string: {
              len: '${label} phải có đúng ${len} ký tự',
              min: '${label} phải có ít nhất ${min} ký tự',
              max: '${label} không được vượt quá ${max} ký tự',
              range: '${label} phải có độ dài từ ${min} đến ${max} ký tự',
            },
            number: {
              len: '${label} phải bằng ${len}',
              min: '${label} phải ≥ ${min}',
              max: '${label} phải ≤ ${max}',
              range: '${label} phải trong khoảng từ ${min} đến ${max}',
            },
            array: {
              len: 'Phải chọn đúng ${len} mục',
              min: 'Phải chọn ít nhất ${min} mục',
              max: 'Chỉ được chọn tối đa ${max} mục',
              range: 'Số mục phải từ ${min} đến ${max}',
            },
pattern: {
              mismatch: '${label} không đúng định dạng',
            },
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </TooltipProvider>
  </QueryClientProvider>
)