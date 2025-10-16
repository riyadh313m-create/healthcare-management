import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Users, 
  History as HistoryIcon,
  Plus
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import DoctorsPage from '../pages/DoctorsPage';
import AddDoctorPage from '../components/AddDoctorPage';
import HistoryPage from '../components/HistoryPage';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  
  .number {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ActionDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-top: 0;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const HeadDashboard: React.FC = () => {
  const { state } = useAppContext();
  const [currentView, setCurrentView] = useState<'dashboard' | 'doctors' | 'addDoctor' | 'history'>('dashboard');

  // إحصائيات خاصة بالمستشفى
  const hospitalDoctors = state.doctors.filter(
    doctor => doctor.currentHospital === state.currentUser?.hospitalId && !doctor.isArchived
  );

  const activeDoctors = hospitalDoctors.filter(doctor => doctor.status === 'مستمر بالدوام').length;
  const onLeaveDoctors = hospitalDoctors.filter(doctor => doctor.status !== 'مستمر بالدوام').length;
  
  const hospitalInfo = state.hospitals.find(h => h.id === state.currentUser?.hospitalId);

  const renderContent = () => {
    switch (currentView) {
      case 'doctors':
        return <DoctorsPage />;
      case 'addDoctor':
        return <AddDoctorPage onBack={() => setCurrentView('doctors')} />;
      case 'history':
        return <HistoryPage onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <DashboardContainer>
            <WelcomeSection>
              <h1>مرحباً، {state.currentUser?.fullName}</h1>
              <p>رئيس أطباء {hospitalInfo?.name}</p>
              
              <StatsGrid>
                <StatCard>
                  <div className="number">{hospitalDoctors.length}</div>
                  <div className="label">إجمالي الأطباء</div>
                </StatCard>
                <StatCard>
                  <div className="number">{activeDoctors}</div>
                  <div className="label">في الخدمة</div>
                </StatCard>
                <StatCard>
                  <div className="number">{onLeaveDoctors}</div>
                  <div className="label">في إجازة</div>
                </StatCard>
                <StatCard>
                  <div className="number">{hospitalInfo?.requiredDoctors || 0}</div>
                  <div className="label">العدد المطلوب</div>
                </StatCard>
              </StatsGrid>
            </WelcomeSection>

            <h2>الإجراءات السريعة</h2>
            <QuickActions>
              <ActionCard onClick={() => setCurrentView('doctors')}>
                <ActionIcon>
                  <Users size={28} />
                </ActionIcon>
                <ActionTitle>إدارة الأطباء</ActionTitle>
                <ActionDescription>
                  عرض وإدارة جميع أطباء المستشفى، تعديل البيانات، والنقل بين المستشفيات
                </ActionDescription>
              </ActionCard>

              <ActionCard onClick={() => setCurrentView('addDoctor')}>
                <ActionIcon>
                  <Plus size={28} />
                </ActionIcon>
                <ActionTitle>إضافة طبيب جديد</ActionTitle>
                <ActionDescription>
                  إضافة طبيب جديد للمستشفى مع جميع البيانات والمعلومات المطلوبة
                </ActionDescription>
              </ActionCard>

              <ActionCard onClick={() => setCurrentView('history')}>
                <ActionIcon>
                  <HistoryIcon size={28} />
                </ActionIcon>
                <ActionTitle>سجل العمليات</ActionTitle>
                <ActionDescription>
                  عرض جميع العمليات والإجراءات التي تمت في النظام مع التواريخ والتفاصيل
                </ActionDescription>
              </ActionCard>
            </QuickActions>

            {/* معلومات إضافية */}
            <InfoCard>
              <h3>معلومات المستشفى</h3>
              <InfoGrid>
                <div>
                  <strong>اسم المستشفى:</strong> {hospitalInfo?.name}
                </div>
                <div>
                  <strong>العنوان:</strong> {hospitalInfo?.address}
                </div>
                <div>
                  <strong>الهاتف:</strong> {hospitalInfo?.phone}
                </div>
                <div>
                  <strong>النوع:</strong> {hospitalInfo?.type === 'hospital' ? 'مستشفى' : 'مركز صحي'}
                </div>
              </InfoGrid>
            </InfoCard>
          </DashboardContainer>
        );
    }
  };

  return renderContent();
};

export default HeadDashboard;