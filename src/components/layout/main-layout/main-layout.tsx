import Header from './header';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main>
        <Outlet  />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
