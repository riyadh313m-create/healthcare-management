import React from 'react';
import styled from 'styled-components';
import { 
  Hospital, 
  Users, 
  ArrowLeftRight, 
  TrendingUp,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 15px;
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
    color: #666;
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
`;

const AlertsSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const AlertItem = styled.div<{ type: 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  background: ${props => props.type === 'warning' ? '#fff3cd' : '#d1ecf1'};
  border: 1px solid ${props => props.type === 'warning' ? '#ffeaa7' : '#bee5eb'};
`;

const RecentActivities = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
`;

const ActivityInfo = styled.div`
  flex: 1;
  
  .action {
    color: #333;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .time {
    color: #666;
    font-size: 0.8rem;
  }
`;

const DashboardPage: React.FC = () => {
  const { state } = useAppContext();

  // حساب الإحصائيات
  const totalHospitals = state.hospitals.length;
  const totalDoctors = state.doctors.filter(d => !d.isArchived).length;
  const activeDoctors = state.doctors.filter(d => 
    !d.isArchived && d.status === 'مستمر بالدوام'
  ).length;
  const pendingTransfers = state.transfers.filter(t => 
    t.status === 'pending'
  ).length;

  // حساب المستشفيات التي تحتاج أطباء
  const hospitalsNeedingDoctors = state.hospitals.filter(hospital => {
    const currentDoctors = state.doctors.filter(d => 
      d.currentHospital === hospital.id && !d.isArchived
    ).length;
    return currentDoctors < hospital.requiredDoctors;
  });

  // الأنشطة الأخيرة - فلترة حسب المستشفى لرئيس الأطباء
  const recentActivities = state.history
    .filter(activity => {
      // إذا كان رئيس أطباء مستشفى، عرض أنشطته أو أنشطة مستشفاه فقط
      if (state.currentUser?.role === 'head_of_doctors') {
        return activity.userId === state.currentUser.id || 
               activity.entityId === state.currentUser.hospitalId ||
               (activity.type === 'doctor_added' && state.doctors.find(d => d.id === activity.entityId)?.currentHospital === state.currentUser.hospitalId) ||
               (activity.type === 'transfer_requested' && state.transfers.find(t => t.id === activity.entityId)?.toHospitalId === state.currentUser.hospitalId);
      }
      // رئيس الأطباء العموم يرى كل شيء
      return true;
    })
    .slice(-5)
    .reverse();

  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard>
          <StatIcon color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <Hospital size={28} />
          </StatIcon>
          <StatInfo>
            <div className="number">{totalHospitals}</div>
            <div className="label">المستشفيات والمراكز</div>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)">
            <Users size={28} />
          </StatIcon>
          <StatInfo>
            <div className="number">{totalDoctors}</div>
            <div className="label">إجمالي الأطباء</div>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)">
            <CheckCircle size={28} />
          </StatIcon>
          <StatInfo>
            <div className="number">{activeDoctors}</div>
            <div className="label">الأطباء النشطون</div>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <ArrowLeftRight size={28} />
          </StatIcon>
          <StatInfo>
            <div className="number">{pendingTransfers}</div>
            <div className="label">التنقلات المعلقة</div>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* التنبيهات */}
      <AlertsSection>
        <SectionTitle>التنبيهات</SectionTitle>
        {hospitalsNeedingDoctors.length > 0 ? (
          hospitalsNeedingDoctors.map(hospital => {
            const currentDoctors = state.doctors.filter(d => 
              d.currentHospital === hospital.id && !d.isArchived
            ).length;
            const shortage = hospital.requiredDoctors - currentDoctors;
            
            return (
              <AlertItem key={hospital.id} type="warning">
                <AlertCircle size={20} color="#856404" />
                <div>
                  <strong>{hospital.name}</strong> يحتاج إلى {shortage} طبيب إضافي
                  (الحالي: {currentDoctors}، المطلوب: {hospital.requiredDoctors})
                </div>
              </AlertItem>
            );
          })
        ) : (
          <AlertItem type="info">
            <CheckCircle size={20} color="#0c5460" />
            <div>جميع المستشفيات لديها العدد الكافي من الأطباء</div>
          </AlertItem>
        )}

        {pendingTransfers > 0 && (
          <AlertItem type="info">
            <TrendingUp size={20} color="#0c5460" />
            <div>يوجد {pendingTransfers} طلب تنقل في انتظار الموافقة</div>
          </AlertItem>
        )}
      </AlertsSection>

      {/* الأنشطة الأخيرة */}
      {recentActivities.length > 0 && (
        <RecentActivities>
          <SectionTitle>الأنشطة الأخيرة</SectionTitle>
          {recentActivities.map((activity, index) => (
            <ActivityItem key={activity.id || `activity-${index}`}>
              <ActivityIcon>
                <TrendingUp size={18} />
              </ActivityIcon>
              <ActivityInfo>
                <div className="action">{activity.details}</div>
                <div className="time">
                  {new Date(activity.timestamp).toLocaleDateString('ar-IQ')} - {activity.performedBy}
                </div>
              </ActivityInfo>
            </ActivityItem>
          ))}
        </RecentActivities>
      )}
    </DashboardContainer>
  );
};

export default DashboardPage;