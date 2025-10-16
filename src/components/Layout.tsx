import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Hospital, 
  Users, 
  ArrowLeftRight, 
  UserCheck, 
  LogOut,
  Home,
  Bell,
  User,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationPanel from './NotificationPanel';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div<{ $isOpen?: boolean }>`
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    z-index: 1000;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
    box-shadow: ${props => props.$isOpen ? '-4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;

const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    
    h2 {
      margin: 0;
      font-size: 1.2rem;
    }
  }
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Overlay = styled.div<{ $isOpen?: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }
`;

const CloseButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1001;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const Logo = styled.div`
  text-align: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    font-size: 1.3rem;
  }
  
  p {
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const Navigation = styled.nav`
  flex: 1;
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin: 0.25rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  span {
    font-size: 0.95rem;
  }
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-top: auto;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
  padding-top: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none; /* إخفاء Header على الموبايل (عندنا MobileHeader) */
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  animation: ${props => props.$isOpen ? 'fadeIn 0.2s ease' : 'none'};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: 0;
    left: 0;
    width: 100vw;
    max-width: 100vw;
    border-radius: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ContentArea = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  pageTitle: string;
}

const HospitalName = styled.p`
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeSection, 
  onSectionChange, 
  pageTitle 
}) => {
  const { state, logout } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false); // إغلاق القائمة بعد الاختيار
  };
  
  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'hospitals', label: 'المستشفيات', icon: Hospital },
    { id: 'doctors', label: 'الأطباء', icon: Users },
    { id: 'transfers', label: 'التنقلات', icon: ArrowLeftRight },
    { id: 'approvals', label: 'الموافقات', icon: CheckCircle },
    { id: 'heads', label: 'رؤساء الأطباء', icon: UserCheck },
    { id: 'profile', label: 'الملف الشخصي', icon: User },
  ];

  // فلترة القائمة حسب صلاحيات المستخدم
  const filteredMenuItems = menuItems.filter(() => {
    if (state.currentUser?.role === 'head_of_doctors') {
      // رئيس أطباء المستشفى يرى فقط الأطباء والتنقلات (سيتم استبدالها بواجهة خاصة)
      return false; // لن نعرض القائمة العادية لرؤساء الأطباء
    }
    // رئيس الأطباء العموم يرى كل شيء
    return true;
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <LayoutContainer>
      {/* Mobile Header */}
      <MobileHeader>
        <h2>{pageTitle}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <MenuButton onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {state.notifications.filter(n => !n.isRead && (!n.recipientId || n.recipientId === state.currentUser?.id)).length > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {state.notifications.filter(n => !n.isRead && (!n.recipientId || n.recipientId === state.currentUser?.id)).length}
              </span>
            )}
          </MenuButton>
          <MenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </MenuButton>
        </div>
      </MobileHeader>

      {/* Overlay للموبايل */}
      <Overlay $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />

      {/* Sidebar */}
      <Sidebar $isOpen={isMobileMenuOpen}>
        <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
          <X size={20} />
        </CloseButton>

        <Logo>
          <h2>نظام إدارة الأطباء</h2>
          <p>إدارة توزيع الأطباء</p>
        </Logo>

        <UserInfo>
          <h3>{state.currentUser?.fullName}</h3>
          <p>{state.currentUser?.jobTitle}</p>
          {state.currentUser?.role === 'head_of_doctors' && (
            <HospitalName>
              {state.hospitals.find(h => h.id === state.currentUser?.hospitalId)?.name}
            </HospitalName>
          )}
        </UserInfo>

        <Navigation>
          {filteredMenuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <NavItem
                key={item.id}
                $active={activeSection === item.id}
                onClick={() => handleSectionChange(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </Navigation>

        <LogoutButton onClick={handleLogout}>
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </LogoutButton>
      </Sidebar>

      <MainContent>
        <Header>
          <HeaderLeft>
            {activeSection !== 'dashboard' && (
              <BackButton onClick={() => onSectionChange('dashboard')}>
                <ArrowRight size={18} />
                رجوع
              </BackButton>
            )}
            <PageTitle>{pageTitle}</PageTitle>
          </HeaderLeft>
          <HeaderActions>
            <NotificationButton onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              {state.notifications.filter(n => !n.isRead && (!n.recipientId || n.recipientId === state.currentUser?.id)).length > 0 && (
                <NotificationBadge>
                  {state.notifications.filter(n => !n.isRead && (!n.recipientId || n.recipientId === state.currentUser?.id)).length}
                </NotificationBadge>
              )}
            </NotificationButton>
            <NotificationDropdown $isOpen={showNotifications}>
              <NotificationPanel />
            </NotificationDropdown>
          </HeaderActions>
        </Header>
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;