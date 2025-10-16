import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  User, 
  Save, 
  ArrowLeft,
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
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
  margin-bottom: 1rem;
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const FormBody = styled.div`
  padding: 2rem;
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

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
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

  &[type="password"] {
    padding-right: 3rem;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #374151;
  }
`;

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  
  .title {
    font-weight: 600;
    color: #0369a1;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .content {
    color: #0c4a6e;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
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

const AlertMessage = styled.div<{ type: 'success' | 'error' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.type === 'success' ? `
    background: #d1fae5;
    border: 1px solid #a7f3d0;
    color: #065f46;
  ` : `
    background: #fee2e2;
    border: 1px solid #fca5a5;
    color: #991b1b;
  `}
`;

interface ProfilePageProps {
  onBack?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { state, dispatch, addHistoryRecord } = useAppContext();
  const currentUser = state.currentUser;
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    username: currentUser?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: 'يجب إدخال الاسم الكامل' });
      return false;
    }

    if (!formData.username.trim()) {
      setMessage({ type: 'error', text: 'يجب إدخال اسم المستخدم' });
      return false;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'يجب إدخال كلمة المرور الحالية لتغيير كلمة المرور' });
        return false;
      }

      if (formData.currentPassword !== currentUser?.password) {
        setMessage({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة' });
        return false;
      }

      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل' });
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'كلمة المرور الجديدة وتأكيدها غير متطابقتين' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updatedUser = {
        ...currentUser,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        username: formData.username.trim(),
        password: formData.newPassword || currentUser.password
      };

      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      dispatch({ type: 'LOGIN', payload: updatedUser });

      addHistoryRecord(
        'user_updated',
        `تم تحديث معلومات المستخدم: ${updatedUser.fullName}`,
        updatedUser.id,
        'user'
      );

      setMessage({ type: 'success', text: 'تم تحديث المعلومات بنجاح' });
      
      // مسح كلمات المرور من النموذج
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث المعلومات' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser || currentUser.role !== 'chief_of_doctors') {
    return (
      <PageContainer>
        <Header>
          <h2>غير مخول</h2>
          <p>ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </Header>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {onBack && (
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
          العودة
        </BackButton>
      )}

      <Header>
        <h2>
          <User size={24} />
          إدارة الملف الشخصي
        </h2>
        <p>إدارة معلومات رئيس الأطباء العموم</p>
      </Header>

      <FormCard>
        <FormHeader>
          <h3>
            <Shield size={20} />
            المعلومات الشخصية
          </h3>
        </FormHeader>

        <FormBody>
          {message && (
            <AlertMessage type={message.type}>
              {message.text}
            </AlertMessage>
          )}

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
                  placeholder="أدخل الاسم الكامل"
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

            <FormGroup>
              <Label>
                <Shield size={16} />
                اسم المستخدم
              </Label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
              />
            </FormGroup>

            <InfoBox>
              <div className="title">
                <Lock size={16} />
                تغيير كلمة المرور
              </div>
              <div className="content">
                اتركها فارغة إذا كنت لا تريد تغيير كلمة المرور الحالية
              </div>
            </InfoBox>

            <FormGroup>
              <Label>
                <Lock size={16} />
                كلمة المرور الحالية
              </Label>
              <InputWrapper>
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية"
                />
                <PasswordToggle
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>

            <Row>
              <FormGroup>
                <Label>
                  <Lock size={16} />
                  كلمة المرور الجديدة
                </Label>
                <InputWrapper>
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة"
                    minLength={6}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </PasswordToggle>
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>
                  <Lock size={16} />
                  تأكيد كلمة المرور
                </Label>
                <InputWrapper>
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="أكد كلمة المرور الجديدة"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </PasswordToggle>
                </InputWrapper>
              </FormGroup>
            </Row>
          </Form>
        </FormBody>

        <ButtonGroup>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save size={16} />
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </ButtonGroup>
      </FormCard>
    </PageContainer>
  );
};

export default ProfilePage;