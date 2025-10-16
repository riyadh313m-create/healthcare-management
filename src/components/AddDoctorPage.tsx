import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Calendar, 
  User, 
  Phone, 
  GraduationCap,
  Briefcase,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Doctor, JobTitle, DoctorStatus } from '../types';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const FormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Required = styled.span`
  color: #dc3545;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &:invalid {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid #c3e6cb;
  margin-bottom: 1rem;
`;

interface AddDoctorPageProps {
  onBack: () => void;
}

const AddDoctorPage: React.FC<AddDoctorPageProps> = ({ onBack }) => {
  const { state, dispatch, addHistoryRecord } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    jobTitle: 'اخصائي' as JobTitle,
    graduationYear: new Date().getFullYear() - 5,
    specialization: '',
    gender: 'male' as 'male' | 'female',
    startDate: new Date().toISOString().split('T')[0],
    status: 'مستمر بالدوام' as DoctorStatus,
    notes: ''
  });

  const jobTitles: JobTitle[] = [
    'اخصائي',
    'مقيم اقدم',
    'تدرج',
    'مقيم دوري'
  ];

  const statuses: DoctorStatus[] = [
    'مستمر بالدوام',
    'اجازة مرضية',
    'اجازة امومة',
    'اجازة طويلة'
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
    'جراحة اطفال',
    'تنفسية',
    'امراض كلى',
    'فاملي',
    'مقيم دوري'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'الاختصاص مطلوب';
    }

    if (formData.graduationYear < 1970 || formData.graduationYear > new Date().getFullYear()) {
      newErrors.graduationYear = 'سنة التخرج غير صحيحة';
    }

    if (formData.phone && !/^07[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 07 ويتكون من 11 رقم)';
    }

    const startDate = new Date(formData.startDate);
    if (startDate > new Date()) {
      newErrors.startDate = 'تاريخ المباشرة لا يمكن أن يكون في المستقبل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!state.currentUser?.hospitalId) {
      setErrors({ general: 'لا يمكن تحديد المستشفى' });
      return;
    }

    setIsSubmitting(true);

    try {
      const newDoctor: Doctor = {
        id: Date.now().toString(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        jobTitle: formData.jobTitle,
        graduationYear: formData.graduationYear,
        originalHospital: state.currentUser.hospitalId,
        currentHospital: state.currentUser.hospitalId,
        specialization: formData.specialization.trim(),
        status: formData.status,
        gender: formData.gender,
        startDate: new Date(formData.startDate),
        isArchived: false
      };

      dispatch({ type: 'ADD_DOCTOR', payload: newDoctor });
      
      addHistoryRecord(
        'doctor_added',
        `تم إضافة طبيب جديد: ${formData.fullName} في ${state.hospitals.find(h => h.id === state.currentUser?.hospitalId)?.name}`,
        newDoctor.id,
        'doctor'
      );

      setSuccessMessage(`تم إضافة الطبيب ${formData.fullName} بنجاح`);
      
      // إعادة تعيين النموذج
      setFormData({
        fullName: '',
        phone: '',
        jobTitle: 'طبيب عام',
        graduationYear: new Date().getFullYear() - 5,
        specialization: '',
        gender: 'male',
        startDate: new Date().toISOString().split('T')[0],
        status: 'مستمر بالدوام',
        notes: ''
      });

      // إخفاء رسالة النجاح بعد 3 ثواني
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إضافة الطبيب' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // إزالة الخطأ عند تعديل الحقل
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
          العودة لقائمة الأطباء
        </BackButton>
        <h2>إضافة طبيب جديد</h2>
      </Header>

      {successMessage && (
        <SuccessMessage>{successMessage}</SuccessMessage>
      )}

      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>
                <User size={16} />
                الاسم الكامل <Required>*</Required>
              </Label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="أدخل الاسم الكامل"
                required
              />
              {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
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
                placeholder="07xxxxxxxxx"
                pattern="07[0-9]{9}"
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                الجنس <Required>*</Required>
              </Label>
              <Select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                required
                title="اختر الجنس"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Briefcase size={16} />
                العنوان الوظيفي <Required>*</Required>
              </Label>
              <Select
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                required
                title="اختر العنوان الوظيفي"
              >
                {jobTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <GraduationCap size={16} />
                سنة التخرج <Required>*</Required>
              </Label>
              <Input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                min="1970"
                max={new Date().getFullYear()}
                required
              />
              {errors.graduationYear && <ErrorMessage>{errors.graduationYear}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                الاختصاص <Required>*</Required>
              </Label>
              <Select
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                required
                title="اختر الاختصاص"
              >
                <option value="">اختر الاختصاص</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </Select>
              {errors.specialization && <ErrorMessage>{errors.specialization}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                <Calendar size={16} />
                تاريخ المباشرة <Required>*</Required>
              </Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                الحالة <Required>*</Required>
              </Label>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                required
                title="اختر الحالة"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Building2 size={16} />
                المستشفى
              </Label>
              <Input
                type="text"
                value={state.hospitals.find(h => h.id === state.currentUser?.hospitalId)?.name || 'غير محدد'}
                disabled
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label>ملاحظات إضافية</Label>
            <TextArea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="أدخل أي ملاحظات إضافية..."
            />
          </FormGroup>

          {errors.general && (
            <ErrorMessage style={{ marginTop: '1rem', fontSize: '1rem' }}>
              {errors.general}
            </ErrorMessage>
          )}

          <ButtonGroup>
            <ActionButton type="button" onClick={onBack}>
              إلغاء
            </ActionButton>
            <ActionButton 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              <Plus size={18} />
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة الطبيب'}
            </ActionButton>
          </ButtonGroup>
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default AddDoctorPage;