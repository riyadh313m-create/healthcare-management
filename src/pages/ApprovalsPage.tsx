import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Building,
  ArrowLeft,
  Filter,
  Calendar,
  AlertCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/apiService';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.$color};
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .stat-title {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.$color};
    margin: 0;
  }
  
  .stat-icon {
    color: ${props => props.$color};
  }
`;

const TransfersList = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TransferItem = styled.div<{ $status: string }>`
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  border-left: 4px solid ${props => {
    switch (props.$status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'completed': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9fafb;
  }
`;

const TransferHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TransferInfo = styled.div`
  flex: 1;
`;

const DoctorName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DoctorDetails = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const DoctorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #4b5563;
  border: 1px solid #e5e7eb;
`;

const TransferRoute = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.75rem 0;
  color: #6b7280;
  font-size: 0.9rem;
`;

const HospitalBadge = styled.span`
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  background: ${props => {
    switch (props.$status) {
      case 'pending': return '#fef3c7';
      case 'approved': return '#d1fae5';
      case 'rejected': return '#fee2e2';
      case 'completed': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'pending': return '#d97706';
      case 'approved': return '#059669';
      case 'rejected': return '#dc2626';
      case 'completed': return '#2563eb';
      default: return '#6b7280';
    }
  }};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TransferMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ $variant: 'approve' | 'reject' | 'info' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background: ${props => {
    switch (props.$variant) {
      case 'approve': return '#10b981';
      case 'reject': return '#ef4444';
      case 'info': return '#6b7280';
      default: return '#6b7280';
    }
  }};
  color: white;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReasonBox = styled.div`
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  
  .icon {
    margin-bottom: 1rem;
    color: #d1d5db;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #374151;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const ApprovalsPage: React.FC = () => {
  const { state, dispatch, addNotification, addHistoryRecord } = useAppContext();
  const [statusFilter, setStatusFilter] = useState<string>('');

  // فلترة التنقلات
  const filteredTransfers = state.transfers.filter(transfer => {
    if (statusFilter && transfer.status !== statusFilter) return false;
    return true;
  });

  // إحصائيات سريعة
  const stats = {
    pending: state.transfers.filter(t => t.status === 'pending').length,
    approved: state.transfers.filter(t => t.status === 'approved').length,
    rejected: state.transfers.filter(t => t.status === 'rejected').length,
    completed: state.transfers.filter(t => t.status === 'completed').length,
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'approved': return 'موافق عليه';
      case 'rejected': return 'مرفوض';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'approved': return <CheckCircle size={14} />;
      case 'rejected': return <XCircle size={14} />;
      case 'completed': return <CheckCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const handleApproveTransfer = async (transferId: string) => {
    const transfer = state.transfers.find(t => t.id === transferId);
    if (!transfer) return;

    try {
      // تحديث حالة النقل باستخدام API
      const updatedTransfer = await apiService.updateTransferStatus(transferId, 'approved');
      dispatch({ type: 'UPDATE_TRANSFER', payload: updatedTransfer });

      // تحديث موقع الطبيب إلى المستشفى الجديد باستخدام API
      const doctor = state.doctors.find(d => d.id === transfer.doctorId);
      if (doctor) {
        const updatedDoctor = await apiService.updateDoctor(doctor.id, { 
          currentHospital: transfer.toHospitalId 
        });
        dispatch({ type: 'UPDATE_DOCTOR', payload: updatedDoctor });
      }

      // إضافة إشعار لرئيس أطباء المستشفى الجديدة
      const fromHospital = state.hospitals.find(h => h.id === transfer.fromHospitalId);
      const toHospital = state.hospitals.find(h => h.id === transfer.toHospitalId);
      
      addNotification(
        'transfer_approved',
        'تم الموافقة على طلب النقل',
        `تم نقل ${doctor?.fullName} من ${fromHospital?.name} إلى ${toHospital?.name}`,
        toHospital?.headOfDoctors || 'chief_of_doctors'
      );

      // إضافة سجل تاريخي
      addHistoryRecord(
        'transfer_approved',
        `تم الموافقة على نقل الطبيب ${state.doctors.find(d => d.id === transfer.doctorId)?.fullName} إلى ${state.hospitals.find(h => h.id === transfer.toHospitalId)?.name}`,
        transferId,
        'transfer'
      );
    } catch (error) {
      console.error('Error approving transfer:', error);
      alert('حدث خطأ أثناء الموافقة على النقل');
    }
  };

  const handleRejectTransfer = (transferId: string) => {
    const transfer = state.transfers.find(t => t.id === transferId);
    if (!transfer) return;

    const updatedTransfer = { ...transfer, status: 'rejected' as const };
    dispatch({ type: 'UPDATE_TRANSFER', payload: updatedTransfer });

      // إضافة إشعار لرئيس أطباء المستشفى الحالية
      const doctor = state.doctors.find(d => d.id === transfer.doctorId);
      const fromHospital = state.hospitals.find(h => h.id === transfer.fromHospitalId);
      const toHospital = state.hospitals.find(h => h.id === transfer.toHospitalId);
      
      addNotification(
        'transfer_rejected',
        'تم رفض طلب النقل',
        `تم رفض نقل ${doctor?.fullName} من ${fromHospital?.name} إلى ${toHospital?.name}`,
        fromHospital?.headOfDoctors || 'chief_of_doctors'
      );    // إضافة سجل تاريخي
    addHistoryRecord(
      'transfer_rejected',
      `تم رفض نقل الطبيب ${state.doctors.find(d => d.id === transfer.doctorId)?.fullName} إلى ${state.hospitals.find(h => h.id === transfer.toHospitalId)?.name}`,
      transferId,
      'transfer'
    );
  };

  return (
    <PageContainer>
      <Header>
        <h2>
          <CheckCircle size={24} />
          الموافقات والطلبات
        </h2>
        <p>إدارة طلبات نقل الأطباء والموافقات المطلوبة</p>
      </Header>

      <StatsGrid>
        <StatCard $color="#f59e0b">
          <div className="stat-header">
            <h3 className="stat-title">في الانتظار</h3>
            <Clock size={20} className="stat-icon" />
          </div>
          <p className="stat-value">{stats.pending}</p>
        </StatCard>

        <StatCard $color="#10b981">
          <div className="stat-header">
            <h3 className="stat-title">موافق عليها</h3>
            <CheckCircle size={20} className="stat-icon" />
          </div>
          <p className="stat-value">{stats.approved}</p>
        </StatCard>

        <StatCard $color="#ef4444">
          <div className="stat-header">
            <h3 className="stat-title">مرفوضة</h3>
            <XCircle size={20} className="stat-icon" />
          </div>
          <p className="stat-value">{stats.rejected}</p>
        </StatCard>

        <StatCard $color="#3b82f6">
          <div className="stat-header">
            <h3 className="stat-title">مكتملة</h3>
            <CheckCircle size={20} className="stat-icon" />
          </div>
          <p className="stat-value">{stats.completed}</p>
        </StatCard>
      </StatsGrid>

      <FilterSection>
        <FilterRow>
          <FilterGroup>
            <Filter size={18} />
            <label>حالة الطلب:</label>
            <Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              title="فلتر حالة الطلب"
            >
              <option value="">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="approved">موافق عليه</option>
              <option value="rejected">مرفوض</option>
              <option value="completed">مكتمل</option>
            </Select>
          </FilterGroup>
        </FilterRow>
      </FilterSection>

      <TransfersList>
        {filteredTransfers.length === 0 ? (
          <EmptyState>
            <CheckCircle size={48} className="icon" />
            <h3>لا توجد طلبات</h3>
            <p>لا توجد طلبات نقل تحتاج للمراجعة حالياً</p>
          </EmptyState>
        ) : (
          filteredTransfers
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
            .map((transfer) => {
              const doctor = state.doctors.find(d => d.id === transfer.doctorId);
              const fromHospital = state.hospitals.find(h => h.id === transfer.fromHospitalId);
              const toHospital = state.hospitals.find(h => h.id === transfer.toHospitalId);

              return (
                <TransferItem key={transfer.id} $status={transfer.status}>
                  <TransferHeader>
                    <TransferInfo>
                      <DoctorName>
                        <User size={18} />
                        {doctor?.fullName || 'طبيب غير معروف'}
                      </DoctorName>
                      
                      {doctor && (
                        <DoctorDetails>
                          <DoctorBadge>
                            <Briefcase size={14} />
                            {doctor.jobTitle}
                          </DoctorBadge>
                          <DoctorBadge>
                            <GraduationCap size={14} />
                            {doctor.specialization}
                          </DoctorBadge>
                        </DoctorDetails>
                      )}
                      
                      <TransferRoute>
                        <HospitalBadge>
                          <Building size={14} />
                          {fromHospital?.name || 'مستشفى غير معروف'}
                        </HospitalBadge>
                        <ArrowLeft size={16} />
                        <HospitalBadge>
                          <Building size={14} />
                          {toHospital?.name || 'مستشفى غير معروف'}
                        </HospitalBadge>
                      </TransferRoute>
                    </TransferInfo>

                    <StatusBadge $status={transfer.status}>
                      {getStatusIcon(transfer.status)}
                      {getStatusLabel(transfer.status)}
                    </StatusBadge>
                  </TransferHeader>

                  {transfer.notes && (
                    <ReasonBox>
                      <strong>ملاحظات:</strong> {transfer.notes}
                    </ReasonBox>
                  )}

                  <TransferMeta>
                    <MetaItem>
                      <Calendar size={14} />
                      تاريخ الطلب: {new Date(transfer.requestDate).toLocaleDateString('ar-IQ')}
                    </MetaItem>
                    {transfer.notes && (
                      <MetaItem>
                        <AlertCircle size={14} />
                        ملاحظات: {transfer.notes}
                      </MetaItem>
                    )}
                  </TransferMeta>

                  {transfer.status === 'pending' && state.currentUser?.role === 'chief_of_doctors' && (
                    <ActionButtons>
                      <ActionButton 
                        $variant="approve" 
                        onClick={() => handleApproveTransfer(transfer.id)}
                      >
                        <CheckCircle size={14} />
                        موافقة
                      </ActionButton>
                      <ActionButton 
                        $variant="reject" 
                        onClick={() => handleRejectTransfer(transfer.id)}
                      >
                        <XCircle size={14} />
                        رفض
                      </ActionButton>
                    </ActionButtons>
                  )}
                </TransferItem>
              );
            })
        )}
      </TransfersList>
    </PageContainer>
  );
};

export default ApprovalsPage;