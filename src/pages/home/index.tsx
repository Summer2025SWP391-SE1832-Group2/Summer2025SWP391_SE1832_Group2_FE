import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { paths } from '@/utils/constant/path';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className='relative py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50'>
        <div className='container mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6 pb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Xét Nghiệm ADN Công Nghệ Cao
          </h1>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Dịch vụ xét nghiệm ADN hàng đầu với độ chính xác 99.99%, hỗ trợ xác định quan hệ huyết
            thống và các dịch vụ di truyền chuyên nghiệp.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' asChild>
              <Link to={paths.register}>Đặt lịch ngay</Link>
            </Button>
            <Button size='lg' variant='outline'>
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id='services' className='py-20 px-4'>
        <div className='container mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Dịch vụ của chúng tôi</h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Chúng tôi cung cấp các dịch vụ xét nghiệm ADN chuyên nghiệp với quy trình chuẩn quốc
              tế
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='border-2 hover:border-primary/50 transition-colors'>
              <CardHeader>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                  <span className='text-2xl'>🧬</span>
                </div>
                <CardTitle>Xét nghiệm ADN dân sự</CardTitle>
                <CardDescription>
                  Xác định quan hệ huyết thống cho các mục đích cá nhân, không có giá trị pháp lý
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm text-muted-foreground mb-4'>
                  <li>✓ Lấy mẫu tại nhà</li>
                  <li>✓ Kết quả trong 5-7 ngày</li>
                  <li>✓ Độ chính xác 99.99%</li>
                </ul>
                <Button className='w-full'>Chọn dịch vụ</Button>
              </CardContent>
            </Card>

            <Card className='border-2 hover:border-primary/50 transition-colors'>
              <CardHeader>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
                  <span className='text-2xl'>⚖️</span>
                </div>
                <CardTitle>Xét nghiệm ADN hành chính</CardTitle>
                <CardDescription>
                  Xét nghiệm có giá trị pháp lý, được các cơ quan nhà nước công nhận
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm text-muted-foreground mb-4'>
                  <li>✓ Lấy mẫu tại cơ sở</li>
                  <li>✓ Quy trình chuẩn pháp lý</li>
                  <li>✓ Có giá trị tại tòa án</li>
                </ul>
                <Button className='w-full'>Chọn dịch vụ</Button>
              </CardContent>
            </Card>

            <Card className='border-2 hover:border-primary/50 transition-colors'>
              <CardHeader>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                  <span className='text-2xl'>🏠</span>
                </div>
                <CardTitle>Dịch vụ tại nhà</CardTitle>
                <CardDescription>
                  Nhân viên đến tận nơi lấy mẫu, tiện lợi và bảo mật tuyệt đối
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm text-muted-foreground mb-4'>
                  <li>✓ Nhân viên chuyên nghiệp</li>
                  <li>✓ Thiết bị hiện đại</li>
                  <li>✓ Bảo mật thông tin</li>
                </ul>
                <Button className='w-full'>Chọn dịch vụ</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id='about' className='bg-white py-20 px-4'>
        <div className='container mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold'>Về chúng tôi</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            {/* Text content */}
            <div>
              <h3 className='text-2xl font-semibold mb-4'>Xét nghiệm ADN tại nhà – Bloodline</h3>
              <p className='text-muted-foreground mb-6'>
                Bloodline mang đến giải pháp xét nghiệm ADN uy tín, bảo mật và tiện lợi ngay tại
                nhà. Không cần di chuyển – chỉ cần đặt lịch, chuyên viên sẽ đến tận nơi lấy mẫu và
                kết quả sẽ được trả nhanh chóng qua hệ thống bảo mật cao.
              </p>
              <ul className='list-disc list-inside mb-6 text-muted-foreground text-sm space-y-1'>
                <li>Chính xác 99.99% – công nghệ đạt chuẩn quốc tế</li>
                <li>Bảo mật thông tin tuyệt đối – an tâm tuyệt đối</li>
                <li>Giao mẫu tận nơi – không cần đến phòng lab</li>
              </ul>
              <Button className='bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full'>
                Đăng ký xét nghiệm
              </Button>
            </div>

            {/* Image */}
            <div className='w-full'>
              <img
                src='https://png.pngtree.com/png-clipart/20240905/original/pngtree-doctors-team-png-image_15943672.png'
                alt='Mật ong nguyên chất'
                className='rounded-xl shadow-lg object-cover w-full h-auto'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 bg-muted/50'>
        <div className='container mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Lợi ích của dịch vụ</h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Tại sao bạn nên chọn BloodLine DNA cho nhu cầu xét nghiệm của mình
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>🎯</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Độ chính xác cao</h3>
              <p className='text-muted-foreground'>
                Công nghệ hiện đại đảm bảo độ chính xác lên đến 99.99% cho mọi xét nghiệm
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>⚡</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Kết quả nhanh chóng</h3>
              <p className='text-muted-foreground'>
                Nhận kết quả trong vòng 5-7 ngày làm việc với quy trình tối ưu
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>🔒</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Bảo mật tuyệt đối</h3>
              <p className='text-muted-foreground'>
                Thông tin và kết quả được bảo mật theo tiêu chuẩn quốc tế nghiêm ngặt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-20 px-4'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Liên hệ với chúng tôi</h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📞</span>
              </div>
              <h3 className='font-semibold mb-2'>Hotline</h3>
              <p className='text-muted-foreground'>1900 599 927</p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📧</span>
              </div>
              <h3 className='font-semibold mb-2'>Email</h3>
              <p className='text-muted-foreground'>info@bloodline-dna.com</p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📍</span>
              </div>
              <h3 className='font-semibold mb-2'>Địa chỉ</h3>
              <p className='text-muted-foreground'>123 Nguyễn Thị Minh Khai, Q.1, TP.HCM</p>
            </div>
          </div>

          <Button size='lg' asChild>
            <Link to={paths.register}>Đặt lịch tư vấn</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
