import StyledComponentsRegistry from '@/lib/AntdRegistry';
import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components';
import { UserContextProvider } from '@/context/UserContext';

export const metadata: Metadata = {
  title: 'Appointment Web Application',
  description: 'A web application that manages appointments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <UserContextProvider>
        <body className='relative scroll-smooth overflow-x-hidden'>
          <Header />
          <StyledComponentsRegistry>
            <section
              id='app__content'
              className='w-full min-w-full h-max min-h-screen flex flex-row justify-center items-start overflow-x-hidden'
            >
              {children}
            </section>
          </StyledComponentsRegistry>
        </body>
      </UserContextProvider>
    </html>
  );
}
