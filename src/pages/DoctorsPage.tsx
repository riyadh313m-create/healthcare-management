import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ArrowLeftRight, 
  Archive,
  UserPlus,
  Eye,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  GraduationCap,
  Edit
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/apiService';
import AddDoctorModal from '../components/AddDoctorModal';
import EditDoctorModal from '../components/EditDoctorModal';
import type { Doctor, JobTitle, DoctorStatus } from '../types';
import TransferModal from '../components/TransferModal';

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

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
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
`;

const TotalCount = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
`;

const DoctorsTable = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const DoctorInfo = styled.div`
  .name {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .details {
    font-size: 0.8rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StatusBadge = styled.span<{ status: DoctorStatus }>`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'مستمر بالدوام': return '#d4edda';
      case 'اجازة مرضية': return '#f8d7da';
      case 'اجازة امومة': return '#d1ecf1';
      case 'اجازة طويلة': return '#fff3cd';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'مستمر بالدوام': return '#155724';
      case 'اجازة مرضية': return '#721c24';
      case 'اجازة امومة': return '#0c5460';
      case 'اجازة طويلة': return '#856404';
      default: return '#383d41';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled.button<{ variant: 'view' | 'transfer' | 'archive' }>`
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => {
    switch (props.variant) {
      case 'view': return '#17a2b8';
      case 'transfer': return '#28a745';
      case 'archive': return '#6c757d';
      default: return '#6c757d';
    }
  }};
  color: white;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  h3 {
    margin: 1rem 0 0.5rem 0;
  }
  
  p {
    margin: 0;
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const StatusInModal = styled(StatusBadge)`
  margin-right: 0.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DoctorDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DoctorsPage: React.FC = () => {
  const { state, dispatch, addHistoryRecord } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState<JobTitle | ''>('');
  const [statusFilter, setStatusFilter] = useState<DoctorStatus | ''>('');
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [doctorToTransfer, setDoctorToTransfer] = useState<Doctor | null>(null);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  // فلترة الأطباء
  const filteredDoctors = useMemo(() => {
    let doctors = state.doctors.filter(doctor => !doctor.isArchived);

    // فلترة حسب صلاحيات المستخدم
    if (state.currentUser?.role === 'head_of_doctors' && state.currentUser.hospitalId) {
      doctors = doctors.filter(doctor => 
        doctor.currentHospital === state.currentUser?.hospitalId
      );
    }

    // فلترة حسب البحث
    if (searchTerm) {
      doctors = doctors.filter(doctor =>
        doctor.fullName.includes(searchTerm) ||
        doctor.specialization.includes(searchTerm)
      );
    }

    // فلترة حسب العنوان الوظيفي
    if (jobTitleFilter) {
      doctors = doctors.filter(doctor => doctor.jobTitle === jobTitleFilter);
    }

    // فلترة حسب الحالة
    if (statusFilter) {
      doctors = doctors.filter(doctor => doctor.status === statusFilter);
    }

    // فلترة حسب المستشفى
    if (hospitalFilter) {
      doctors = doctors.filter(doctor => doctor.currentHospital === hospitalFilter);
    }

    // فلترة حسب التخصص
    if (specializationFilter) {
      doctors = doctors.filter(doctor => doctor.specialization === specializationFilter);
    }

    // ترتيب أبجدي حسب الاسم
    doctors.sort((a, b) => a.fullName.localeCompare(b.fullName, 'ar'));

    return doctors;
  }, [state.doctors, state.currentUser, searchTerm, jobTitleFilter, statusFilter, hospitalFilter, specializationFilter]);

  const jobTitles: JobTitle[] = [
    'اخصائي',
    'مقيم اقدم',
    'تدرج',
    'مقيم دوري'
  ];

  const specializations = [
    'الجراحة العامة',
    'الكسور',
    'البولية',
    'النسائية',
    'الاطفال',
    'الباطنية',
    'العيون',
    'ENT',
    'جراحة صدر',
    'جراحة جملة عصبية',
    'جملة عصبية',
    'جراحة تجميلية',
    'نفسية',
    'مفاصل',
    'جلدية',
    'طوارئ',
    'أنعاش',
    'أشعة تشخيصية',
    'أشعة تداخلية',
    'طب عام',
    'مقيم دوري',
    'الطب النووي',
    'الاورام',
    'الايكو',
    'التخدير'
  ];

  const statuses: DoctorStatus[] = [
    'مستمر بالدوام',
    'اجازة مرضية',
    'اجازة امومة',
    'اجازة طويلة'
  ];

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const handleTransferDoctor = (doctor: Doctor) => {
    setDoctorToTransfer(doctor);
    setIsTransferModalOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setIsEditModalOpen(true);
  };

  const handleArchiveDoctor = async (doctor: Doctor) => {
    if (window.confirm(`هل أنت متأكد من أرشفة الطبيب ${doctor.fullName} للدراسات؟`)) {
      try {
        const updatedDoctor = await apiService.updateDoctor(doctor.id, { isArchived: true });
        dispatch({ type: 'UPDATE_DOCTOR', payload: updatedDoctor });
        
        addHistoryRecord(
          'doctor_archived',
          `تم أرشفة الطبيب ${doctor.fullName} للدراسات`,
          doctor.id,
          'doctor'
        );
      } catch (error) {
        console.error('Error archiving doctor:', error);
        alert('حدث خطأ أثناء أرشفة الطبيب');
      }
    }
  };

  const getHospitalName = (hospitalId: string) => {
    return state.hospitals.find(h => h.id === hospitalId)?.name || 'غير محدد';
  };

  const calculateWorkDuration = (startDate: Date | string) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} سنة ${months > 0 ? `و ${months} شهر` : ''}`;
    } else {
      return `${months} شهر`;
    }
  };

  return (
    <PageContainer>
      <TopSection>
        <FilterSection>
          <FilterGroup>
            <Search size={18} color="#666" />
            <SearchInput
              placeholder="البحث عن طبيب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Filter size={18} color="#666" />
            <FilterSelect
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value as JobTitle | '')}
              title="فلترة حسب العنوان الوظيفي"
            >
              <option value="">جميع العناوين</option>
              {jobTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DoctorStatus | '')}
            title="فلترة حسب الحالة"
          >
            <option value="">جميع الحالات</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </FilterSelect>

          {state.currentUser?.role === 'chief_of_doctors' && (
            <FilterSelect 
              value={hospitalFilter} 
              onChange={(e) => setHospitalFilter(e.target.value)}
              title="فلترة حسب المستشفى"
            >
              <option value="">جميع المستشفيات</option>
              {state.hospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
              ))}
            </FilterSelect>
          )}
          
          <FilterSelect 
            value={specializationFilter} 
            onChange={(e) => setSpecializationFilter(e.target.value)}
            title="فلترة حسب التخصص"
          >
            <option value="">جميع التخصصات</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </FilterSelect>
        </FilterSection>        <ActionButton 
          variant="primary"
          onClick={() => setIsAddDoctorModalOpen(true)}
        >
          <UserPlus size={18} />
          إضافة طبيب جديد
        </ActionButton>
      </TopSection>

      <TotalCount>
        <Users size={20} />
        المجموع الكلي: {filteredDoctors.length} طبيب
      </TotalCount>

      <DoctorsTable>
        <TableHeader>
          <div>معلومات الطبيب</div>
          <div>العنوان الوظيفي</div>
          <div>الاختصاص</div>
          <div>المستشفى الحالية</div>
          <div>الحالة</div>
          <div>الإجراءات</div>
        </TableHeader>

        {filteredDoctors.map(doctor => (
          <TableRow key={doctor.id}>
            <DoctorInfo>
              <div className="name">{doctor.fullName}</div>
              <div className="details">
                <Phone size={12} />
                {doctor.phone || 'غير محدد'}
                <span>•</span>
                <GraduationCap size={12} />
                {doctor.graduationYear}
              </div>
            </DoctorInfo>
            <div>{doctor.jobTitle}</div>
            <div>{doctor.specialization}</div>
            <div>{getHospitalName(doctor.currentHospital)}</div>
            <StatusBadge status={doctor.status}>{doctor.status}</StatusBadge>
            <ActionButtons>
              <SmallButton 
                variant="view" 
                onClick={() => handleViewDoctor(doctor)}
                title="عرض التفاصيل"
              >
                <Eye size={14} />
              </SmallButton>
              <SmallButton 
                variant="edit" 
                onClick={() => handleEditDoctor(doctor)}
                title="تعديل المعلومات"
              >
                <Edit size={14} />
              </SmallButton>
              <SmallButton 
                variant="transfer" 
                onClick={() => handleTransferDoctor(doctor)}
                title="نقل أو تنسيب"
              >
                <ArrowLeftRight size={14} />
              </SmallButton>
              {state.currentUser?.role === 'chief_of_doctors' && (
                <SmallButton 
                  variant="archive" 
                  onClick={() => handleArchiveDoctor(doctor)}
                  title="أرشفة للدراسات"
                >
                  <Archive size={14} />
                </SmallButton>
              )}
            </ActionButtons>
          </TableRow>
        ))}

        {filteredDoctors.length === 0 && (
          <EmptyState>
            <Users size={48} color="#ccc" />
            <h3>لا يوجد أطباء</h3>
            <p>لم يتم العثور على أطباء مطابقين للفلاتر المحددة</p>
          </EmptyState>
        )}
      </DoctorsTable>

      {/* مودال عرض تفاصيل الطبيب */}
      <Modal isOpen={isViewModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>تفاصيل الطبيب</h3>
            <CloseButton onClick={() => setIsViewModalOpen(false)}>×</CloseButton>
          </ModalHeader>

          {selectedDoctor && (
            <DoctorDetails>
              <div>
                <strong>الاسم الكامل:</strong> {selectedDoctor.fullName}
              </div>
              <div>
                <strong>الجنس:</strong> {selectedDoctor.gender === 'male' ? 'ذكر' : 'أنثى'}
              </div>
              <div>
                <strong>رقم الهاتف:</strong> {selectedDoctor.phone || 'غير محدد'}
              </div>
              <div>
                <strong>العنوان الوظيفي:</strong> {selectedDoctor.jobTitle}
              </div>
              <div>
                <strong>الاختصاص:</strong> {selectedDoctor.specialization}
              </div>
              <div>
                <strong>سنة التخرج:</strong> {selectedDoctor.graduationYear}
              </div>
              <div>
                <strong>الملاك:</strong> {getHospitalName(selectedDoctor.originalHospital)}
              </div>
              <div>
                <strong>الدوام الحالي:</strong> {getHospitalName(selectedDoctor.currentHospital)}
              </div>
              <div>
                <strong>تاريخ المباشرة:</strong> {new Date(selectedDoctor.startDate).toLocaleDateString('ar-IQ')}
              </div>
              <div>
                <strong>مدة الدوام:</strong> {calculateWorkDuration(selectedDoctor.startDate)}
              </div>
              <div>
                <strong>الحالة:</strong> 
                <StatusInModal status={selectedDoctor.status}>
                  {selectedDoctor.status}
                </StatusInModal>
              </div>
            </DoctorDetails>
          )}
        </ModalContent>
      </Modal>

      {/* Transfer Modal */}
      {isTransferModalOpen && doctorToTransfer && (
        <TransferModal
          doctor={doctorToTransfer}
          onClose={() => {
            setIsTransferModalOpen(false);
            setDoctorToTransfer(null);
          }}
        />
      )}

      {/* Add Doctor Modal */}
      {isAddDoctorModalOpen && (
        <AddDoctorModal
          onClose={() => setIsAddDoctorModalOpen(false)}
        />
      )}

      {/* Edit Doctor Modal */}
      {isEditModalOpen && doctorToEdit && (
        <EditDoctorModal
          doctor={doctorToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setDoctorToEdit(null);
          }}
        />
      )}
    </PageContainer>
  );
};

export default DoctorsPage;