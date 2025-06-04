import { Link } from 'react-router-dom';
import { paths } from '@/utils/constant/path';

const Footer = () => {
  return (
    <footer className='bg-muted/50 border-t'>
      <div className='container mx-auto py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>DNA</span>
              </div>
              <span className='text-xl font-bold'>BloodLine</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              Dịch vụ xét nghiệm ADN hàng đầu Việt Nam với công nghệ tiên tiến và độ chính xác cao.
            </p>
          </div>

          {/* Services */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Dịch vụ</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                <a href='#' className='hover:text-primary'>
                  Xét nghiệm ADN dân sự
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary'>
                  Xét nghiệm ADN hành chính
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary'>
                  Xét nghiệm tại nhà
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary'>
                  Xét nghiệm tại cơ sở
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Hỗ trợ</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                <Link to={paths.login} className='hover:text-primary'>
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to={paths.register} className='hover:text-primary'>
                  Đăng ký
                </Link>
              </li>
              <li>
                <a href='#' className='hover:text-primary'>
                  Hướng dẫn lấy mẫu
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-primary'>
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Liên hệ</h3>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <p>📞 Hotline: 1900 599 927</p>
              <p>📧 Email: info@bloodline-dna.com</p>
              <p>📍 Địa chỉ: 123 Nguyễn Thị Minh Khai, Q.1, TP.HCM</p>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t text-center text-sm text-muted-foreground'>
          <p>&copy; 2025 BloodLine DNA. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
