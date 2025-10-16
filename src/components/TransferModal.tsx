import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  ArrowLeftRight, 
  X, 
  Building, 
  Calendar,
  FileText,
  Check
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import apiService from '../services/apiService';
import type { Doctor } from '../types';

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

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
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
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const DoctorInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  margin-bottom: 1rem;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }
`;

const TransferRoute = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
`;

const HospitalBox = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e5e7eb;
  flex: 1;

  .label {
    font-size: 0.8rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .name {
    font-weight: 600;
    color: #1f2937;
  }
`;

const ArrowIcon = styled.div`
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 0.5rem;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
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

interface TransferModalProps {
  doctor: Doctor;
  onClose: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ doctor, onClose }) => {
  const { state, dispatch, addHistoryRecord, addNotification } = useAppContext();
  const [toHospitalId, setToHospitalId] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentHospital = state.hospitals.find(h => h.id === doctor.currentHospital);
  const availableHospitals = state.hospitals.filter(h => h.id !== doctor.currentHospital);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toHospitalId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // رئيس الأطباء العموم يمكنه النقل مباشرة بدون موافقة
      if (state.currentUser?.role === 'chief_of_doctors') {
        // تحديث المستشفى الحالي للطبيب مباشرة باستخدام API
        const updatedDoctor = await apiService.updateDoctor(doctor.id, {
          currentHospital: toHospitalId
        });
        dispatch({ type: 'UPDATE_DOCTOR', payload: updatedDoctor });

        // إضافة إشعار لرئيس الأطباء العموم
        addNotification(
          'transfer_approved',
          'تم تنفيذ النقل',
          `تم نقل ${doctor.fullName} من ${currentHospital?.name} إلى ${state.hospitals.find(h => h.id === toHospitalId)?.name}`,
          'chief_of_doctors'
        );

        // تسجيل في التاريخ
        addHistoryRecord(
          'transfer_approved',
          `تم نقل الطبيب ${doctor.fullName} من ${currentHospital?.name} إلى ${state.hospitals.find(h => h.id === toHospitalId)?.name} مباشرة`,
          doctor.id,
          'doctor'
        );

        alert('تم نقل الطبيب بنجاح');
      } else {
        // إنشاء طلب النقل للموافقة (لرؤساء الأطباء)
        const transferData = {
          doctorId: doctor.id,
          fromHospitalId: doctor.currentHospital,
          toHospitalId,
          reason: notes || `نقل من ${currentHospital?.name} إلى ${state.hospitals.find(h => h.id === toHospitalId)?.name}`
        };

        // إضافة النقل باستخدام API
        const transfer = await apiService.createTransfer(transferData);
        dispatch({ type: 'ADD_TRANSFER', payload: transfer });

        // إضافة إشعار لرئيس الأطباء العموم
        addNotification(
          'transfer_request',
          'طلب نقل جديد',
          `طلب نقل الطبيب ${doctor.fullName} من ${currentHospital?.name} إلى ${state.hospitals.find(h => h.id === toHospitalId)?.name}`,
          'chief_of_doctors'
        );

        // تسجيل في التاريخ
        addHistoryRecord(
          'transfer_requested',
          `تم طلب نقل الطبيب ${doctor.fullName} من ${currentHospital?.name} إلى ${state.hospitals.find(h => h.id === toHospitalId)?.name}`,
          doctor.id,
          'doctor'
        );

        alert('تم إرسال طلب النقل للموافقة');
      }

      onClose();
    } catch (error) {
      console.error('Error transferring doctor:', error);
      alert('حدث خطأ أثناء النقل');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            <ArrowLeftRight size={24} />
            نقل طبيب
          </h3>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <DoctorInfo>
            <h4>{doctor.fullName}</h4>
            <p>{doctor.jobTitle} - {doctor.specialization}</p>
          </DoctorInfo>

          <TransferRoute>
            <HospitalBox>
              <div className="label">من</div>
              <div className="name">{currentHospital?.name || 'غير محدد'}</div>
            </HospitalBox>
            
            <ArrowIcon>
              <ArrowLeftRight size={20} />
            </ArrowIcon>
            
            <HospitalBox>
              <div className="label">إلى</div>
              <div className="name">
                {toHospitalId ? state.hospitals.find(h => h.id === toHospitalId)?.name : 'اختر المستشفى'}
              </div>
            </HospitalBox>
          </TransferRoute>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <Building size={16} />
                المستشفى المقصود
              </Label>
              <Select
                value={toHospitalId}
                onChange={(e) => setToHospitalId(e.target.value)}
                required
              >
                <option value="">اختر المستشفى</option>
                {[...availableHospitals].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(hospital => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Calendar size={16} />
                تاريخ النقل
              </Label>
              <Input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FileText size={16} />
                ملاحظات إضافية
              </Label>
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أدخل أي ملاحظات حول النقل..."
              />
            </FormGroup>
          </Form>
        </ModalBody>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose} type="button">
            إلغاء
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!toHospitalId || isSubmitting}
          >
            <Check size={16} />
            {isSubmitting ? 'جاري التنفيذ...' : 
             state.currentUser?.role === 'chief_of_doctors' ? 'تنفيذ النقل' : 'إرسال طلب النقل'}
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default TransferModal;