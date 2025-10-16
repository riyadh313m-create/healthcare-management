import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Building, 
  X, 
  Users,
  Save
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/apiService';
import type { Hospital } from '../types';

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
  max-width: 700px;
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

const SpecializationSection = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: #f9fafb;
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SpecializationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const SpecializationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }
`;

const SpecializationName = styled.span`
  flex: 1;
  font-size: 0.95rem;
  color: #374151;
  font-weight: 500;
`;

const CountsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CountBox = styled.div<{ type: 'required' | 'current' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const CountLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
`;

const RequirementInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
  }

  /* إزالة الأسهم من input type number */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  -moz-appearance: textfield;
`;

const CurrentCount = styled.div`
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #059669;
  background: #f0fdf4;
  border-color: #bbf7d0;
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

const TotalDisplay = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
  color: #667eea;
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

interface HospitalModalProps {
  hospital?: Hospital;
  onClose: () => void;
}

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
  'مقيم دوري',
  'أنعاش',
  'أشعة تشخيصية',
  'أشعة تداخلية',
  'طب عام',
  'الطب النووي',
  'الاورام',
  'الايكو',
  'التخدير',
  'تدرج'
];

const HospitalModal: React.FC<HospitalModalProps> = ({ hospital, onClose }) => {
  const { dispatch, addHistoryRecord, state } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: hospital?.name || '',
    type: hospital?.type || 'hospital' as 'hospital' | 'health_center'
  });

  const [specializationRequirements, setSpecializationRequirements] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    
    // تهيئة جميع التخصصات بقيمة 0
    specializations.forEach(spec => {
      defaults[spec] = 0;
    });
    
    // إذا كان هناك مستشفى موجود، تحميل قيمه
    if (hospital?.specializationRequirements) {
      if (Array.isArray(hospital.specializationRequirements)) {
        // إذا كانت array من MongoDB
        hospital.specializationRequirements.forEach((req: any) => {
          defaults[req.specialization] = req.required || req.count || 0;
        });
      } else if (typeof hospital.specializationRequirements === 'object') {
        // إذا كانت object
        Object.entries(hospital.specializationRequirements).forEach(([spec, count]) => {
          defaults[spec] = count as number;
        });
      }
    }
    
    return defaults;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializationChange = (specialization: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setSpecializationRequirements(prev => ({
      ...prev,
      [specialization]: Math.max(0, numValue)
    }));
  };

  const calculateTotalRequired = () => {
    return Object.values(specializationRequirements).reduce((sum, count) => sum + count, 0);
  };

  // حساب عدد الأطباء الموجودين لكل تخصص
  const getCurrentDoctorCounts = () => {
    const counts: Record<string, number> = {};
    
    if (!hospital?.id) return counts;
    
    specializations.forEach(spec => {
      const doctorsInSpec = state.doctors.filter(
        doctor => doctor.currentHospital === hospital.id && 
                  doctor.specialization === spec &&
                  !doctor.isArchived
      ).length;
      counts[spec] = doctorsInSpec;
    });
    
    return counts;
  };

  const currentCounts = getCurrentDoctorCounts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // تحويل specializationRequirements إلى array للـ backend
      const specializationRequirementsArray = Object.entries(specializationRequirements)
        .map(([specialization, count]) => ({
          specialization,
          required: count
        }));

      const hospitalData = {
        name: formData.name,
        address: hospital?.address || 'غير محدد',
        phone: hospital?.phone || 'غير محدد',
        type: formData.type,
        requiredDoctors: calculateTotalRequired(),
        currentDoctors: hospital?.currentDoctors || 0,
        specializationRequirements: specializationRequirementsArray
      };

      if (hospital && hospital.id) {
        // تحديث مستشفى موجود باستخدام API
        const updatedHospital = await apiService.updateHospital(hospital.id, hospitalData);
        dispatch({ type: 'UPDATE_HOSPITAL', payload: updatedHospital });
        addHistoryRecord(
          'hospital_updated',
          `تم تحديث بيانات مستشفى ${updatedHospital.name}`,
          updatedHospital.id,
          'hospital'
        );
      } else {
        // إضافة مستشفى جديد باستخدام API
        const newHospital = await apiService.createHospital(hospitalData);
        dispatch({ type: 'ADD_HOSPITAL', payload: newHospital });
        addHistoryRecord(
          'hospital_added',
          `تم إضافة مستشفى جديد: ${newHospital.name}`,
          newHospital.id,
          'hospital'
        );
      }

      onClose();
    } catch (error) {
      console.error('Error saving hospital:', error);
      alert('حدث خطأ أثناء حفظ المستشفى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            <Building size={24} />
            {hospital ? 'تحديث بيانات المستشفى' : 'إضافة مستشفى جديد'}
          </h3>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <Building size={16} />
                اسم المستشفى
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="أدخل اسم المستشفى"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                نوع المنشأة
              </Label>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="hospital">مستشفى</option>
                <option value="health_center">مركز صحي</option>
              </Select>
            </FormGroup>

            <SpecializationSection>
              <SectionTitle>
                <Users size={18} />
                الحاجة للأطباء حسب التخصص
              </SectionTitle>
              <SpecializationGrid>
                {specializations.map(specialization => (
                  <SpecializationItem key={specialization}>
                    <SpecializationName>{specialization}</SpecializationName>
                    <CountsContainer>
                      <CountBox type="required">
                        <CountLabel>المطلوب</CountLabel>
                        <RequirementInput
                          type="number"
                          min="0"
                          value={specializationRequirements[specialization] || 0}
                          onChange={(e) => handleSpecializationChange(specialization, e.target.value)}
                          placeholder="0"
                        />
                      </CountBox>
                      {hospital && (
                        <CountBox type="current">
                          <CountLabel>الموجود</CountLabel>
                          <CurrentCount>
                            {currentCounts[specialization] || 0}
                          </CurrentCount>
                        </CountBox>
                      )}
                    </CountsContainer>
                  </SpecializationItem>
                ))}
              </SpecializationGrid>
              <TotalDisplay>
                إجمالي الحاجة: {calculateTotalRequired()} طبيب
              </TotalDisplay>
            </SpecializationSection>
          </Form>
        </ModalBody>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose} type="button">
            إلغاء
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
          >
            <Save size={16} />
            {isSubmitting ? 'جاري الحفظ...' : hospital ? 'تحديث البيانات' : 'إضافة المستشفى'}
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default HospitalModal;