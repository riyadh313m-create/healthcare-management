import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2,
  Eye,
  EyeOff,
  User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/apiService';
import type { User as UserType } from '../types';

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

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => {
    switch (props.variant) {
      case 'primary': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'danger': return '#dc3545';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => props.variant === 'primary' || props.variant === 'danger' ? 'white' : '#333'};
  border: ${props => props.variant === 'secondary' ? '1px solid #dee2e6' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const HospitalsTable = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr auto;
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

const HospitalInfo = styled.div`
  .name {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .address {
    font-size: 0.8rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const HeadInfo = styled.div`
  .name {
    font-weight: 500;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .contact {
    font-size: 0.8rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const StatusBadge = styled.span<{ assigned: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.assigned ? '#d4edda' : '#f8d7da'};
  color: ${props => props.assigned ? '#155724' : '#721c24'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled.button<{ variant: 'edit' | 'delete' }>`
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.variant === 'edit' ? '#17a2b8' : '#dc3545'};
  color: white;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
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
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const NoHeadText = styled.div`
  color: #666;
  font-style: italic;
`;

const HeadsPage: React.FC = () => {
  const { state, dispatch, addHistoryRecord } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    jobTitle: 'رئيس أطباء',
    hospitalId: '',
    username: '',
    password: ''
  });

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await apiService.getUsers();
        // تحويل _id إلى id و hospitalId._id إلى hospitalId
        const users = usersData.map((u: any) => ({
          ...u,
          id: u._id,
          hospitalId: u.hospitalId?._id || u.hospitalId
        }));
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [dispatch]);

  const handleOpenModal = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName,
        phone: user.phone,
        jobTitle: user.jobTitle,
        hospitalId: user.hospitalId || '',
        username: user.username,
        password: user.password
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: '',
        phone: '',
        jobTitle: 'رئيس أطباء',
        hospitalId: '',
        username: '',
        password: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.username || !formData.password || !formData.hospitalId) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    try {
      if (editingUser) {
        // تحديث
        const updatedUser = await apiService.updateUser(editingUser.id, formData);
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        addHistoryRecord(
          'user_updated', 
          `تم تحديث رئيس الأطباء ${formData.fullName}`, 
          editingUser.id, 
          'user'
        );
      } else {
        // إضافة جديد
        console.log('Sending form data:', formData); // للتأكد من البيانات
        const newUser = await apiService.createUser(formData);
        console.log('Received new user:', newUser); // للتأكد من النتيجة
        dispatch({ type: 'ADD_USER', payload: { ...newUser, id: newUser._id } });
        addHistoryRecord(
          'user_added', 
          `تم إضافة رئيس أطباء جديد ${formData.fullName}`, 
          newUser._id || newUser.id, 
          'user'
        );
      }

      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error.message || 'حدث خطأ أثناء حفظ المستخدم');
    }
  };

  const handleDelete = async (user: UserType) => {
    if (window.confirm(`هل أنت متأكد من حذف رئيس الأطباء ${user.fullName}؟`)) {
      try {
        await apiService.deleteUser(user.id);
        dispatch({ type: 'DELETE_USER', payload: user.id });
        addHistoryRecord(
          'user_deleted', 
          `تم حذف رئيس الأطباء ${user.fullName}`, 
          user.id, 
          'user'
        );
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('حدث خطأ أثناء حذف المستخدم');
      }
    }
  };

  const getHospitalName = (hospitalId: string) => {
    return state.hospitals.find(h => h.id === hospitalId)?.name || 'غير محدد';
  };

  const getHeadForHospital = (hospitalId: string) => {
    return state.users.find(u => u.hospitalId === hospitalId && u.role === 'head_of_doctors');
  };

  const availableHospitals = state.hospitals.filter(hospital => {
    if (editingUser && editingUser.hospitalId === hospital.id) {
      return true; // إذا كان يُحرر، يمكن أن يبقى في نفس المستشفى
    }
    return !getHeadForHospital(hospital.id); // إذا لم يكن له رئيس أطباء
  });

  return (
    <PageContainer>
      <TopSection>
        <h2>إدارة رؤساء الأطباء</h2>
        {state.currentUser?.role === 'chief_of_doctors' && (
          <ActionButton variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            إضافة رئيس أطباء جديد
          </ActionButton>
        )}
      </TopSection>

      <HospitalsTable>
        <TableHeader>
          <div>المستشفى</div>
          <div>رئيس الأطباء</div>
          <div>رقم الهاتف</div>
          <div>الحالة</div>
          <div>الإجراءات</div>
        </TableHeader>

        {state.hospitals.map(hospital => {
          const head = getHeadForHospital(hospital.id);
          
          return (
            <TableRow key={hospital.id}>
              <HospitalInfo>
                <div className="name">{hospital.name}</div>
                <div className="address">
                  <Building2 size={12} />
                  {hospital.address}
                </div>
              </HospitalInfo>
              
              {head ? (
                <HeadInfo>
                  <div className="name">{head.fullName}</div>
                  <div className="contact">
                    <User size={12} />
                    {head.username}
                  </div>
                </HeadInfo>
              ) : (
                <NoHeadText>
                  لم يتم تعيين رئيس أطباء
                </NoHeadText>
              )}
              
              <div>{head?.phone || '-'}</div>
              
              <StatusBadge assigned={!!head}>
                {head ? 'معيّن' : 'غير معيّن'}
              </StatusBadge>
              
              <ActionButtons>
                {state.currentUser?.role === 'chief_of_doctors' && (
                  <>
                    {head ? (
                      <>
                        <SmallButton 
                          variant="edit" 
                          onClick={() => handleOpenModal(head)}
                          title="تعديل"
                        >
                          <Edit size={14} />
                        </SmallButton>
                        <SmallButton 
                          variant="delete" 
                          onClick={() => handleDelete(head)}
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </SmallButton>
                      </>
                    ) : (
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => {
                          setFormData(prev => ({ ...prev, hospitalId: hospital.id }));
                          handleOpenModal();
                        }}
                      >
                        <Plus size={14} />
                        تعيين
                      </ActionButton>
                    )}
                  </>
                )}
              </ActionButtons>
            </TableRow>
          );
        })}
      </HospitalsTable>

      {/* مودال إضافة/تعديل رئيس أطباء */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>{editingUser ? 'تعديل رئيس الأطباء' : 'إضافة رئيس أطباء جديد'}</h3>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>الاسم الكامل *</Label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>رقم الهاتف</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>المستشفى *</Label>
              <Select
                value={formData.hospitalId}
                onChange={(e) => setFormData(prev => ({ ...prev, hospitalId: e.target.value }))}
                required
                title="اختر المستشفى"
              >
                <option value="">اختر المستشفى</option>
                {availableHospitals.map(hospital => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>اسم المستخدم *</Label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>كلمة المرور *</Label>
              <PasswordContainer>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </PasswordContainer>
            </FormGroup>

            <ButtonGroup>
              <ActionButton type="button" onClick={handleCloseModal}>
                إلغاء
              </ActionButton>
              <ActionButton variant="primary" type="submit">
                {editingUser ? 'تحديث' : 'إضافة'}
              </ActionButton>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default HeadsPage;