import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Users, 
  Clock,
  UserPlus,
  LogOut,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddDoctorModal from '../components/AddDoctorModal';
import DoctorsPage from './DoctorsPage';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  direction: rtl;
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderTitle = styled.div`
  color: white;
  
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const ContentArea = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
  
  .number {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.9rem;
    color: #666;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: white;
  margin-bottom: 1rem;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const ActionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
`;

const ActionDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;



const HeadOfDoctorsDashboard: React.FC = () => {
  const { state, logout } = useAppContext();
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'doctors' | 'requirements'>('dashboard');
  
  // الحصول على معلومات المستشفى
  const myHospital = state.hospitals.find(h => h.id === state.currentUser?.hospitalId);
  
  // حساب الإحصائيات
  const myDoctors = state.doctors.filter(d => 
    d.currentHospital === state.currentUser?.hospitalId && !d.isArchived
  );
  
  // حساب الأطباء في الخدمة (مستمر بالدوام)
  const activeDoctors = myDoctors.filter(d => d.status === 'مستمر بالدوام').length;
  
  // حساب الأطباء في إجازة (جميع أنواع الإجازات)
  const doctorsOnLeave = myDoctors.filter(d => 
    d.status === 'اجازة مرضية' || d.status === 'اجازة امومة' || d.status === 'اجازة طويلة'
  ).length;
  
  // حساب الاحتياج (الفرق بين المطلوب والموجود)
  const requiredDoctors = myHospital?.requiredDoctors || 0;
  const currentDoctorsCount = myDoctors.length;
  const shortage = requiredDoctors - currentDoctorsCount;
  
  // عرض صفحة الأطباء إذا تم اختيارها
  if (currentView === 'doctors') {
    return (
      <DashboardContainer>
        <Header>
          <HeaderTitle>
            <h1>إدارة الأطباء</h1>
            <p>رئيس أطباء {myHospital?.name || 'المستشفى'}</p>
          </HeaderTitle>
          <HeaderButtons>
            <LogoutButton onClick={() => setCurrentView('dashboard')}>
              <ArrowRight size={20} />
              <span>رجوع</span>
            </LogoutButton>
            <LogoutButton onClick={logout}>
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </LogoutButton>
          </HeaderButtons>
        </Header>
        <ContentArea>
          <DoctorsPage />
        </ContentArea>
      </DashboardContainer>
    );
  }
  
  // عرض صفحة الاحتياجات حسب التخصص
  if (currentView === 'requirements') {
    const specializationCounts: Record<string, { current: number; required: number }> = {};
    
    // حساب العدد الحالي لكل تخصص
    myDoctors.forEach(doctor => {
      if (!specializationCounts[doctor.specialization]) {
        specializationCounts[doctor.specialization] = { current: 0, required: 0 };
      }
      specializationCounts[doctor.specialization].current++;
    });
    
    // إضافة المتطلبات من المستشفى
    if (myHospital?.specializationRequirements) {
      myHospital.specializationRequirements.forEach((req: any) => {
        const spec = req.specialization;
        if (!specializationCounts[spec]) {
          specializationCounts[spec] = { current: 0, required: 0 };
        }
        specializationCounts[spec].required = req.required || req.count || 0;
      });
    }
    
    return (
      <DashboardContainer>
        <Header>
          <HeaderTitle>
            <h1>احتياجات التخصصات</h1>
            <p>رئيس أطباء {myHospital?.name || 'المستشفى'}</p>
          </HeaderTitle>
          <HeaderButtons>
            <LogoutButton onClick={() => setCurrentView('dashboard')}>
              <ArrowRight size={20} />
              <span>رجوع</span>
            </LogoutButton>
            <LogoutButton onClick={logout}>
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </LogoutButton>
          </HeaderButtons>
        </Header>
        <ContentArea>
          <div style={{ background: 'white', borderRadius: '15px', padding: '2rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>الاحتياج حسب التخصص</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Object.entries(specializationCounts).map(([spec, counts]) => {
                const shortage = counts.required - counts.current;
                return (
                  <div key={spec} style={{ 
                    padding: '1rem', 
                    background: shortage > 0 ? '#fee2e2' : '#d1fae5',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: '#333' }}>{spec}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: '#666' }}>المطلوب: </span>
                        <strong style={{ color: '#333' }}>{counts.required}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#666' }}>الموجود: </span>
                        <strong style={{ color: '#333' }}>{counts.current}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#666' }}>الاحتياج: </span>
                        <strong style={{ color: shortage > 0 ? '#dc2626' : '#059669' }}>
                          {shortage > 0 ? `+${shortage}` : shortage === 0 ? '0' : shortage}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ContentArea>
      </DashboardContainer>
    );
  }
  


  return (
    <DashboardContainer>
      <Header>
        <HeaderTitle>
          <h1>مرحباً, {state.currentUser?.fullName}</h1>
          <p>رئيس أطباء {myHospital?.name || 'المستشفى'}</p>
        </HeaderTitle>
        <LogoutButton onClick={logout}>
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </LogoutButton>
      </Header>

      <ContentArea>
        <StatsGrid>
          <StatCard onClick={() => setCurrentView('requirements')} style={{ cursor: 'pointer' }}>
            <StatIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <Users size={28} />
            </StatIcon>
            <StatInfo>
              <div className="number">{shortage > 0 ? `+${shortage}` : shortage === 0 ? '0' : shortage}</div>
              <div className="label">الاحتياج (اضغط للتفاصيل)</div>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)">
              <Activity size={28} />
            </StatIcon>
            <StatInfo>
              <div className="number">{activeDoctors}</div>
              <div className="label">في الخدمة</div>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <Clock size={28} />
            </StatIcon>
            <StatInfo>
              <div className="number">{doctorsOnLeave}</div>
              <div className="label">في إجازة</div>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <Users size={28} />
            </StatIcon>
            <StatInfo>
              <div className="number">{currentDoctorsCount}</div>
              <div className="label">إجمالي الأطباء</div>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <SectionTitle>الإجراءات السريعة</SectionTitle>
        <ActionsGrid>
          <ActionCard onClick={() => setIsAddDoctorModalOpen(true)}>
            <ActionIcon>
              <UserPlus size={36} />
            </ActionIcon>
            <ActionTitle>إضافة طبيب جديد</ActionTitle>
            <ActionDescription>
              إضافة طبيب جديد للمستشفى مع جميع البيانات والمعلومات المطلوبة
            </ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => setCurrentView('doctors')}>
            <ActionIcon>
              <Users size={36} />
            </ActionIcon>
            <ActionTitle>إدارة الأطباء</ActionTitle>
            <ActionDescription>
              عرض وإدارة جميع أطباء المستشفى، تعديل البيانات، والنقل بين المستشفيات
            </ActionDescription>
          </ActionCard>
        </ActionsGrid>
      </ContentArea>

      {isAddDoctorModalOpen && (
        <AddDoctorModal
          onClose={() => setIsAddDoctorModalOpen(false)}
        />
      )}
    </DashboardContainer>
  );
};

export default HeadOfDoctorsDashboard;
