import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  History, 
  Filter, 
  ArrowLeft,
  Download,
  FileText,
  Clock
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { ActionType } from '../types';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  color: #666;
  
  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    
    .icon {
      color: #007bff;
    }
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
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
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

const Input = styled.input`
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  
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

const HistoryTable = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 3fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 3fr 1fr;
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

const ActionBadge = styled.span<{ action: ActionType }>`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.action) {
      case 'doctor_added': return '#d4edda';
      case 'doctor_transferred': return '#d1ecf1';
      case 'doctor_archived': return '#f8d7da';
      case 'doctor_updated': return '#fff3cd';
      case 'user_added': return '#e2e3e5';
      case 'user_updated': return '#e2e3e5';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.action) {
      case 'doctor_added': return '#155724';
      case 'doctor_transferred': return '#0c5460';
      case 'doctor_archived': return '#721c24';
      case 'doctor_updated': return '#856404';
      case 'user_added': return '#383d41';
      case 'user_updated': return '#383d41';
      default: return '#666';
    }
  }};
`;

const DateTime = styled.div`
  .date {
    font-weight: 500;
    color: #333;
  }
  
  .time {
    font-size: 0.8rem;
    color: #666;
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

const SubTitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const StatusText = styled.span`
  color: #28a745;
  font-size: 0.8rem;
  font-weight: 500;
`;

const SummaryBox = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

interface HistoryPageProps {
  onBack: () => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onBack }) => {
  const { state } = useAppContext();
  const [actionFilter, setActionFilter] = useState<ActionType | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // فلترة السجلات
  const filteredHistory = useMemo(() => {
    let records = state.history;

    // فلترة حسب نوع الإجراء
    if (actionFilter) {
      records = records.filter(record => record.action === actionFilter);
    }

    // فلترة حسب التاريخ
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      records = records.filter(record => new Date(record.timestamp) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // نهاية اليوم
      records = records.filter(record => new Date(record.timestamp) <= toDate);
    }

    // ترتيب حسب التاريخ (الأحدث أولاً)
    return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [state.history, actionFilter, dateFrom, dateTo]);

  const actionTypes: { value: ActionType; label: string }[] = [
    { value: 'doctor_added', label: 'إضافة طبيب' },
    { value: 'doctor_transferred', label: 'نقل طبيب' },
    { value: 'doctor_archived', label: 'أرشفة طبيب' },
    { value: 'doctor_updated', label: 'تحديث طبيب' },
    { value: 'user_added', label: 'إضافة مستخدم' },
    { value: 'user_updated', label: 'تحديث مستخدم' },
  ];

  const getActionLabel = (action: ActionType): string => {
    const actionType = actionTypes.find(type => type.value === action);
    return actionType?.label || action;
  };

  const handleExport = () => {
    // تصدير البيانات كـ CSV
    const headers = ['التاريخ', 'الوقت', 'نوع الإجراء', 'المستخدم', 'التفاصيل'];
    const csvData = filteredHistory.map(record => [
      new Date(record.timestamp).toLocaleDateString('ar-IQ'),
      new Date(record.timestamp).toLocaleTimeString('ar-IQ'),
      getActionLabel(record.action),
      record.performedBy,
      record.details
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `history_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearFilters = () => {
    setActionFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={onBack}>
            <ArrowLeft size={18} />
            العودة
          </BackButton>
          <div>
            <h2>سجل العمليات</h2>
            <SubTitle>
              جميع العمليات والإجراءات المنفذة في النظام
            </SubTitle>
          </div>
        </HeaderLeft>

        <HeaderStats>
          <div className="stat">
            <FileText size={16} className="icon" />
            <span>إجمالي السجلات: {filteredHistory.length}</span>
          </div>
          <div className="stat">
            <Clock size={16} className="icon" />
            <span>آخر تحديث: {state.history.length > 0 ? new Date(Math.max(...state.history.map(h => new Date(h.timestamp).getTime()))).toLocaleDateString('ar-IQ') : 'لا يوجد'}</span>
          </div>
        </HeaderStats>

        <ActionButton variant="secondary" onClick={handleExport}>
          <Download size={18} />
          تصدير البيانات
        </ActionButton>
      </Header>

      <FilterSection>
        <FilterGroup>
          <Filter size={18} color="#666" />
          <span>فلترة:</span>
        </FilterGroup>

        <FilterGroup>
          <span>نوع الإجراء:</span>
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as ActionType | '')}
            title="فلترة حسب نوع الإجراء"
          >
            <option value="">جميع الإجراءات</option>
            {actionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <span>من تاريخ:</span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <span>إلى تاريخ:</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </FilterGroup>

        <ActionButton onClick={clearFilters}>
          مسح الفلاتر
        </ActionButton>
      </FilterSection>

      <HistoryTable>
        <TableHeader>
          <div>التاريخ والوقت</div>
          <div>نوع الإجراء</div>
          <div>المستخدم</div>
          <div>التفاصيل</div>
          <div>الحالة</div>
        </TableHeader>

        {filteredHistory.length > 0 ? (
          filteredHistory.map(record => (
            <TableRow key={record.id}>
              <DateTime>
                <div className="date">
                  {new Date(record.timestamp).toLocaleDateString('ar-IQ')}
                </div>
                <div className="time">
                  {new Date(record.timestamp).toLocaleTimeString('ar-IQ')}
                </div>
              </DateTime>
              
              <ActionBadge action={record.action}>
                {getActionLabel(record.action)}
              </ActionBadge>
              
              <div>{record.performedBy}</div>
              
              <div>{record.details}</div>
              
              <div>
                <StatusText>
                  مكتمل
                </StatusText>
              </div>
            </TableRow>
          ))
        ) : (
          <EmptyState>
            <History size={48} color="#ccc" />
            <h3>لا توجد سجلات</h3>
            <p>لم يتم العثور على سجلات تطابق الفلاتر المحددة</p>
          </EmptyState>
        )}
      </HistoryTable>

      {filteredHistory.length > 0 && (
        <SummaryBox>
          إجمالي السجلات: {filteredHistory.length}
        </SummaryBox>
      )}
    </PageContainer>
  );
};

export default HistoryPage;