import { z } from 'zod';

export const movieSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tên phim'),
  description: z.string().min(1, 'Vui lòng nhập mô tả'),
  duration: z.number().positive('Thời lượng phải lớn hơn 0'),
  releaseDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Ngày phát hành không hợp lệ',
    }),
  director: z.string().min(1, 'Tên đạo diễn không được trống'),
  actors: z
    .array(z.string().min(1, 'Tên diễn viên không được trống'))
    .min(1, 'Phải có ít nhất 1 diễn viên'),
  language: z.string().min(1, 'Ngôn ngữ không được để trống'),
  trailer: z.string().url('Trailer phải là URL hợp lệ').optional().or(z.literal('')),
  poster: z.string().url('Poster phải là URL hợp lệ').optional().or(z.literal('')),
  banner: z.array(z.string().url('Ảnh banner phải là URL hợp lệ')).optional(),
  ageRating: z.enum(['C13', 'C16', 'C18'], {
    required_error: 'Chọn độ tuổi phù hợp',
  }),
  status: z.enum(['sap_chieu', 'dang_chieu', 'ngung_chieu'], {
    required_error: 'Chọn trạng thái phim',
  }),
});
