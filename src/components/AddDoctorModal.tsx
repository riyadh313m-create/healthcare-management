import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  UserPlus, 
  X, 
  User,
  Phone, 
  GraduationCap,
  Building,
  Calendar,
  Briefcase,
  Save
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/apiService';
import type { JobTitle } from '../types';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  direction: rtl;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;

  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &:invalid {
    border-color: #ef4444;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

interface AddDoctorModalProps {
  onClose: () => void;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ onClose }) => {
  const { state, dispatch, addHistoryRecord } = useAppContext();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    jobTitle: 'اخصائي' as JobTitle,
    graduationYear: new Date().getFullYear() - 5,
    specialization: '',
    originalHospital: '',
    currentHospital: '',
    status: 'مستمر بالدوام' as const,
    gender: 'male' as 'male' | 'female',
    startDate: new Date().toISOString().split('T')[0] // تاريخ المباشرة
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    'التخدير',
    'تدرج'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // إنشاء الطبيب باستخدام API
      const doctorData = {
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        jobTitle: formData.jobTitle,
        graduationYear: formData.graduationYear,
        originalHospital: formData.originalHospital,
        currentHospital: formData.currentHospital,
        specialization: formData.specialization,
        status: formData.status,
        gender: formData.gender,
        startDate: new Date(formData.startDate)
      };

      const newDoctor = await apiService.createDoctor(doctorData);

      // تحويل البيانات لتتوافق مع الصيغة المحلية
      const doctorWithId = {
        ...newDoctor,
        id: newDoctor._id || newDoctor.id,
        originalHospital: newDoctor.originalHospital?._id || newDoctor.originalHospital,
        currentHospital: newDoctor.currentHospital?._id || newDoctor.currentHospital
      };

      // تحديث الحالة المحلية
      dispatch({ type: 'ADD_DOCTOR', payload: doctorWithId });

      await addHistoryRecord(
        'doctor_added',
        `تم إضافة طبيب جديد: ${newDoctor.fullName}`,
        newDoctor._id || newDoctor.id,
        'doctor'
      );

      onClose();
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('حدث خطأ أثناء إضافة الطبيب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            <UserPlus size={24} />
            إضافة طبيب جديد
          </h3>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <FormGroup>
                <Label>
                  <User size={16} />
                  الاسم الكامل
                </Label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="أدخل الاسم الكامل للطبيب"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <Phone size={16} />
                  رقم الهاتف
                </Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="07XXXXXXXXX"
                />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>
                  <Briefcase size={16} />
                  العنوان الوظيفي
                </Label>
                <Select
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  required
                >
                  {jobTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  <GraduationCap size={16} />
                  سنة التخرج
                </Label>
                <Input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                  min="1980"
                  max={new Date().getFullYear()}
                  required
                />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>
                  <User size={16} />
                  التخصص
                </Label>
                <Select
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  required
                >
                  <option value="">اختر التخصص</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  <Calendar size={16} />
                  تاريخ المباشرة
                </Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>
                  <Building size={16} />
                  الملاك (المستشفى الأصلي)
                </Label>
                <Select
                  value={formData.originalHospital}
                  onChange={(e) => handleInputChange('originalHospital', e.target.value)}
                  required
                >
                  <option value="">اختر المستشفى</option>
                  {[...state.hospitals].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  <Building size={16} />
                  الدوام الحالي
                </Label>
                <Select
                  value={formData.currentHospital}
                  onChange={(e) => handleInputChange('currentHospital', e.target.value)}
                  required
                >
                  <option value="">اختر المستشفى</option>
                  {[...state.hospitals].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>
                  الجنس
                </Label>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  الحالة
                </Label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="مستمر بالدوام">مستمر بالدوام</option>
                  <option value="اجازة مرضية">إجازة مرضية</option>
                  <option value="اجازة امومة">إجازة أمومة</option>
                  <option value="اجازة طويلة">إجازة طويلة</option>
                </Select>
              </FormGroup>
            </Row>
          </Form>
        </ModalBody>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose} type="button">
            إلغاء
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.fullName.trim()}
          >
            <Save size={16} />
            {isSubmitting ? 'جاري الحفظ...' : 'إضافة الطبيب'}
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default AddDoctorModal;