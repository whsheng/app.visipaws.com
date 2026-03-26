import Header from './Header';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-14 pb-20 px-4 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
