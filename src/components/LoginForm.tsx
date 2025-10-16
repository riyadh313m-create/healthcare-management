import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
  text-align: right;
  direction: rtl;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #ffeaea;
  border-radius: 5px;
  border: 1px solid #e74c3c;
`;

const InfoSection = styled.div`
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #666;
  
  p {
    margin: 0.25rem 0;
  }
`;

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = login(username, password);
      if (!success) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>نظام إدارة الأطباء</Title>
        <Subtitle>إدارة توزيع الأطباء على المستشفيات والمراكز الصحية</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </Form>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <InfoSection>
          <p><strong>حسابات تجريبية:</strong></p>
          <p>رئيس الأطباء العموم: admin / admin123</p>
          <p>رئيس أطباء مستشفى النهرين: head1 / head123</p>
          <p>رئيس أطباء مستشفى ابن سينا: head2 / head123</p>
        </InfoSection>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginForm;