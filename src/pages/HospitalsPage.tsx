import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Building2, Users, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { JobTitle, Hospital } from '../types';
import HospitalModal from '../components/HospitalModal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const FilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterRight = styled.div`
  display: flex;
  gap: 1rem;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const FilterSelect = styled.select`
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

const TotalCount = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
`;

const HospitalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const HospitalCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const HospitalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const HospitalTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HospitalActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background: ${props => {
    switch (props.variant) {
      case 'edit': return '#3b82f6';
      case 'delete': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const HospitalIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const HospitalInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 0.25rem 0;
    color: #333;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.8rem;
    color: #666;
  }
`;

const DoctorStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StatBadge = styled.div<{ type: 'current' | 'required' }>`
  background: ${props => props.type === 'current' ? '#28a745' : '#ffc107'};
  color: ${props => props.type === 'current' ? 'white' : '#333'};
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ContactInfo = styled.div`
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 10px;
  
  h3 {
    margin: 1rem 0 0.5rem 0;
  }
  
  p {
    margin: 0;
  }
`;

const HospitalsPage: React.FC = () => {
  const { state } = useAppContext();
  const [jobTitleFilter, setJobTitleFilter] = useState<JobTitle | ''>('');
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | undefined>(undefined);

  // حساب عدد الأطباء في كل مستشفى حسب العنوان الوظيفي
  const hospitalStats = useMemo(() => {
    const stats = state.hospitals.map(hospital => {
      const hospitalDoctors = state.doctors.filter(
        doctor => doctor.currentHospital === hospital.id && !doctor.isArchived
      );
      
      const filteredDoctors = jobTitleFilter 
        ? hospitalDoctors.filter(doctor => doctor.jobTitle === jobTitleFilter)
        : hospitalDoctors;

      const activeDoctors = filteredDoctors.filter(
        doctor => doctor.status === 'مستمر بالدوام'
      );

      return {
        ...hospital,
        totalDoctors: filteredDoctors.length,
        activeDoctors: activeDoctors.length,
        onLeaveDoctors: filteredDoctors.length - activeDoctors.length,
      };
    });
    
    // ترتيب أبجدي حسب اسم المستشفى
    return stats.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [state.hospitals, state.doctors, jobTitleFilter]);

  const jobTitles: JobTitle[] = [
    'طبيب عام',
    'طبيب اختصاص', 
    'طبيب استشاري',
    'طبيب مقيم',
    'رئيس أطباء',
    'نائب رئيس أطباء'
  ];

  const handleAddHospital = () => {
    setSelectedHospital(undefined);
    setIsHospitalModalOpen(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsHospitalModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsHospitalModalOpen(false);
    setSelectedHospital(undefined);
  };

  return (
    <PageContainer>
      <FilterSection>
        <FilterLeft>
          <Filter size={20} color="#667eea" />
          <span>فلترة حسب العنوان الوظيفي:</span>
          <FilterSelect
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value as JobTitle | '')}
            title="فلترة حسب العنوان الوظيفي"
          >
            <option value="">جميع الأطباء</option>
            {jobTitles.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </FilterSelect>
        </FilterLeft>
        
        {state.currentUser?.role === 'chief_of_doctors' && (
          <FilterRight>
            <AddButton onClick={handleAddHospital}>
              <Plus size={18} />
              إضافة مستشفى
            </AddButton>
          </FilterRight>
        )}
      </FilterSection>

      <TotalCount>
        <Building2 size={20} />
        المجموع الكلي: {hospitalStats.length} مستشفى ومركز صحي
      </TotalCount>

      <HospitalsGrid>
        {hospitalStats.map(hospital => (
          <HospitalCard key={hospital.id}>
            <HospitalHeader>
              <HospitalTitleGroup>
                <HospitalIcon>
                  <Building2 size={24} />
                </HospitalIcon>
                <HospitalInfo>
                  <h3>{hospital.name}</h3>
                  <p>{hospital.type === 'hospital' ? 'مستشفى' : 'مركز صحي'}</p>
                </HospitalInfo>
              </HospitalTitleGroup>
              
              {state.currentUser?.role === 'chief_of_doctors' && (
                <HospitalActions>
                  <ActionButton 
                    variant="edit" 
                    onClick={() => handleEditHospital(hospital)}
                    title="تعديل المستشفى"
                  >
                    <Edit size={16} />
                  </ActionButton>
                </HospitalActions>
              )}
            </HospitalHeader>

            <StatsContainer>
              <StatItem>
                <div className="number">{hospital.totalDoctors}</div>
                <div className="label">العدد الحالي</div>
              </StatItem>
              <StatItem>
                <div className="number">{hospital.requiredDoctors}</div>
                <div className="label">العدد المطلوب</div>
              </StatItem>
              <StatItem>
                <div className="number">
                  {hospital.requiredDoctors - hospital.totalDoctors}
                </div>
                <div className="label">الاحتياج</div>
              </StatItem>
            </StatsContainer>

            <DoctorStats>
              <Users size={16} color="#666" />
              <StatBadge type="current">{hospital.activeDoctors} مستمر</StatBadge>
              {hospital.onLeaveDoctors > 0 && (
                <StatBadge type="required">{hospital.onLeaveDoctors} في إجازة</StatBadge>
              )}
            </DoctorStats>

            {hospital.headOfDoctors && (
              <ContactInfo>
                <p><strong>رئيس الأطباء:</strong> {hospital.headOfDoctors.fullName}</p>
              </ContactInfo>
            )}
          </HospitalCard>
        ))}
      </HospitalsGrid>

      {hospitalStats.length === 0 && (
        <EmptyState>
          <Building2 size={48} color="#ccc" />
          <h3>لا توجد مستشفيات</h3>
          <p>لم يتم إضافة أي مستشفيات بعد</p>
        </EmptyState>
      )}

      {/* Hospital Modal */}
      {isHospitalModalOpen && (
        <HospitalModal
          hospital={selectedHospital}
          onClose={handleCloseModal}
        />
      )}
    </PageContainer>
  );
};

export default HospitalsPage;