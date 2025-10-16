import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import HospitalsPage from './pages/HospitalsPage';
import DoctorsPage from './pages/DoctorsPage';
import TransfersPage from './pages/TransfersPage';
import HeadsPage from './pages/HeadsPage';
import ProfilePage from './pages/ProfilePage';
import ApprovalsPage from './pages/ApprovalsPage';
import HeadOfDoctorsDashboard from './pages/HeadOfDoctorsDashboard';
import './App.css';

// مكون لإدارة المحتوى الرئيسي
const MainApp: React.FC = () => {
  const { state } = useAppContext();
  const [activeSection, setActiveSection] = useState('dashboard');

  // إذا لم يكن المستخدم مسجل دخول، اعرض نموذج تسجيل الدخول
  if (!state.isAuthenticated) {
    return <LoginForm />;
  }

  // إذا كان المستخدم رئيس أطباء مستشفى، اعرض واجهته الخاصة
  if (state.currentUser?.role === 'head_of_doctors') {
    return <HeadOfDoctorsDashboard />;
  }

  // تحديد عنوان الصفحة
  const getPageTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'لوحة التحكم';
      case 'hospitals':
        return 'المستشفيات والمراكز الصحية';
      case 'doctors':
        return 'إدارة الأطباء';
      case 'transfers':
        return 'التنقلات والتنسيبات';
      case 'approvals':
        return 'الموافقات والطلبات';
      case 'heads':
        return 'رؤساء الأطباء';
      case 'profile':
        return 'الملف الشخصي';
      default:
        return 'نظام إدارة الأطباء';
    }
  };

  // عرض المحتوى حسب القسم المختار
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'hospitals':
        return <HospitalsPage />;
      case 'doctors':
        return <DoctorsPage />;
      case 'transfers':
        return <TransfersPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'heads':
        return <HeadsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      pageTitle={getPageTitle()}
    >
      {renderContent()}
    </Layout>
  );
};

// المكون الرئيسي للتطبيق
const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
