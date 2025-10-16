import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  ArrowLeftRight, 
  Download
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/apiService';
import type { JobTitle } from '../types';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TransferFormSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.variant === 'primary' ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  border: ${props => props.variant === 'secondary' ? '1px solid #dee2e6' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DoctorList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const DoctorCard = styled.div<{ selected?: boolean }>`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.selected ? '#f0f4ff' : 'white'};
  
  &:hover {
    border-color: #667eea;
    background: #f8f9fa;
  }
`;

const DoctorInfo = styled.div`
  .name {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .details {
    font-size: 0.9rem;
    color: #666;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const SelectedDoctors = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const SelectedDoctorItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 5px;
  margin: 0.25rem 0;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: #c82333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
`;

const TransferActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const TransfersPage: React.FC = () => {
  const { state, dispatch, addHistoryRecord } = useAppContext();
  const [fromHospital, setFromHospital] = useState('');
  const [toHospital, setToHospital] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState<JobTitle | ''>('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);

  // أطباء المستشفى المحددة للنقل منها
  const availableDoctors = useMemo(() => {
    if (!fromHospital) return [];
    
    let doctors = state.doctors.filter(doctor => 
      doctor.currentHospital === fromHospital && 
      !doctor.isArchived &&
      doctor.status === 'مستمر بالدوام'
    );

    // فلترة حسب العنوان الوظيفي
    if (jobTitleFilter) {
      doctors = doctors.filter(doctor => doctor.jobTitle === jobTitleFilter);
    }

    // فلترة حسب الاختصاص
    if (specializationFilter) {
      doctors = doctors.filter(doctor => 
        doctor.specialization.includes(specializationFilter)
      );
    }

    return doctors;
  }, [state.doctors, fromHospital, jobTitleFilter, specializationFilter]);

  // الاختصاصات المتاحة
  const availableSpecializations = useMemo(() => {
    const specializations = new Set(
      state.doctors
        .filter(d => d.currentHospital === fromHospital && !d.isArchived)
        .map(d => d.specialization)
    );
    return Array.from(specializations);
  }, [state.doctors, fromHospital]);

  const jobTitles: JobTitle[] = [
    'طبيب عام',
    'طبيب اختصاص', 
    'طبيب استشاري',
    'طبيب مقيم',
    'رئيس أطباء',
    'نائب رئيس أطباء'
  ];

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  const handleRemoveDoctor = (doctorId: string) => {
    setSelectedDoctors(prev => prev.filter(id => id !== doctorId));
  };

  const handleTransfer = async () => {
    if (selectedDoctors.length === 0 || !fromHospital || !toHospital) {
      alert('يرجى تحديد الأطباء والمستشفيات');
      return;
    }

    try {
      // تنفيذ عملية النقل الفعلي
      for (const doctorId of selectedDoctors) {
        const doctor = state.doctors.find(d => d.id === doctorId);
        if (doctor) {
          // رئيس الأطباء العموم يمكنه النقل مباشرة بدون موافقة
          if (state.currentUser?.role === 'chief_of_doctors') {
            // تحديث مستشفى الطبيب مباشرة باستخدام API
            const updatedDoctor = await apiService.updateDoctor(doctor.id, {
              currentHospital: toHospital
            });
            
            dispatch({ type: 'UPDATE_DOCTOR', payload: updatedDoctor });
            
            // إضافة سجل تاريخي للنقل المباشر
            addHistoryRecord(
              'transfer_approved',
              `تم نقل الطبيب ${doctor.fullName} من ${getHospitalName(fromHospital)} إلى ${getHospitalName(toHospital)} مباشرة`,
              doctor.id,
              'doctor'
            );
          } else {
            // إنشاء طلب نقل للموافقة (لرؤساء الأطباء)
            const transferRequest = {
              doctorId: doctorId,
              fromHospitalId: fromHospital,
              toHospitalId: toHospital,
              reason: `نقل من ${getHospitalName(fromHospital)} إلى ${getHospitalName(toHospital)}`
            };

            // إضافة طلب النقل باستخدام API
            const newTransfer = await apiService.createTransfer(transferRequest);
            dispatch({ type: 'ADD_TRANSFER', payload: newTransfer });

            // إضافة سجل تاريخي
            addHistoryRecord(
              'transfer_requested',
              `تم طلب نقل الطبيب ${doctor.fullName} من ${getHospitalName(fromHospital)} إلى ${getHospitalName(toHospital)}`,
              doctor.id,
              'doctor'
            );
          }
        }
      }

      const successMessage = state.currentUser?.role === 'chief_of_doctors' 
        ? `تم نقل ${selectedDoctors.length} طبيب بنجاح`
        : `تم إرسال طلبات النقل لـ ${selectedDoctors.length} طبيب بنجاح`;
      
      alert(successMessage);
      
      // إعادة تحميل البيانات لتحديث العرض
      if (state.currentUser?.role === 'chief_of_doctors') {
        window.location.reload();
      }
      
      // إعادة تعيين النموذج
      setSelectedDoctors([]);
      setFromHospital('');
      setToHospital('');
      setJobTitleFilter('');
      setSpecializationFilter('');
    } catch (error) {
      console.error('Error transferring doctors:', error);
      alert('حدث خطأ أثناء عملية النقل');
    }
  };

  const handlePrintList = () => {
    if (selectedDoctors.length === 0) {
      alert('لا توجد أطباء محددون للطباعة');
      return;
    }

    // هنا سيتم تنفيذ عملية الطباعة
    const selectedDoctorsList = state.doctors.filter(d => selectedDoctors.includes(d.id));
    console.log('Print list:', selectedDoctorsList);
  };

  const getHospitalName = (hospitalId: string) => {
    return state.hospitals.find(h => h.id === hospitalId)?.name || 'غير محدد';
  };

  return (
    <PageContainer>
      <TopSection>
        <h2>تنقلات الأطباء</h2>
        <ButtonGroup>
          <ActionButton variant="secondary">
            <Download size={18} />
            تصدير البيانات
          </ActionButton>
        </ButtonGroup>
      </TopSection>

      <TransferFormSection>
        <h3>نقل الأطباء بين المستشفيات</h3>
        
        <FormGrid>
          <FormGroup>
            <Label>النقل من مستشفى:</Label>
            <Select
              value={fromHospital}
              onChange={(e) => {
                setFromHospital(e.target.value);
                setSelectedDoctors([]);
                setJobTitleFilter('');
                setSpecializationFilter('');
              }}
              title="اختر المستشفى للنقل منها"
            >
              <option value="">اختر المستشفى</option>
              {state.hospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>النقل إلى مستشفى:</Label>
            <Select
              value={toHospital}
              onChange={(e) => setToHospital(e.target.value)}
              title="اختر المستشفى للنقل إليها"
            >
              <option value="">اختر المستشفى</option>
              {state.hospitals
                .filter(h => h.id !== fromHospital)
                .map(hospital => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>فلترة حسب العنوان الوظيفي:</Label>
            <Select
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value as JobTitle | '')}
              disabled={!fromHospital}
              title="فلترة حسب العنوان الوظيفي"
            >
              <option value="">جميع العناوين</option>
              {jobTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>فلترة حسب الاختصاص:</Label>
            <Select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              disabled={!fromHospital}
              title="فلترة حسب الاختصاص"
            >
              <option value="">جميع الاختصاصات</option>
              {availableSpecializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </Select>
          </FormGroup>
        </FormGrid>

        {fromHospital && (
          <>
            <h4>أطباء {getHospitalName(fromHospital)}:</h4>
            {availableDoctors.length > 0 ? (
              <DoctorList>
                {availableDoctors.map(doctor => (
                  <DoctorCard
                    key={doctor.id}
                    selected={selectedDoctors.includes(doctor.id)}
                    onClick={() => handleDoctorSelect(doctor.id)}
                  >
                    <DoctorInfo>
                      <div className="name">{doctor.fullName}</div>
                      <div className="details">
                        <div><strong>العنوان الوظيفي:</strong> {doctor.jobTitle}</div>
                        <div><strong>الاختصاص:</strong> {doctor.specialization}</div>
                        <div><strong>سنة التخرج:</strong> {doctor.graduationYear}</div>
                      </div>
                    </DoctorInfo>
                  </DoctorCard>
                ))}
              </DoctorList>
            ) : (
              <EmptyMessage>
                لا توجد أطباء متاحون للنقل في هذا المستشفى
              </EmptyMessage>
            )}
          </>
        )}

        {selectedDoctors.length > 0 && (
          <SelectedDoctors>
            <h4>الأطباء المحددون للنقل ({selectedDoctors.length}):</h4>
            {selectedDoctors.map(doctorId => {
              const doctor = state.doctors.find(d => d.id === doctorId);
              if (!doctor) return null;
              
              return (
                <SelectedDoctorItem key={doctorId}>
                  <div>
                    <strong>{doctor.fullName}</strong> - {doctor.jobTitle} - {doctor.specialization}
                  </div>
                  <RemoveButton onClick={() => handleRemoveDoctor(doctorId)}>
                    إزالة
                  </RemoveButton>
                </SelectedDoctorItem>
              );
            })}
          </SelectedDoctors>
        )}

        <TransferActions>
          <ActionButton 
            variant="secondary"
            onClick={handlePrintList}
            disabled={selectedDoctors.length === 0}
          >
            <Download size={18} />
            طباعة القائمة
          </ActionButton>
          
          <ActionButton 
            variant="primary"
            onClick={handleTransfer}
            disabled={selectedDoctors.length === 0 || !fromHospital || !toHospital}
          >
            <ArrowLeftRight size={18} />
            تنفيذ النقل
          </ActionButton>
        </TransferActions>
      </TransferFormSection>
    </PageContainer>
  );
};

export default TransfersPage;