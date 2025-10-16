import React, { useState } from 'react';
import styled from 'styled-components';
import { Bell, Check, Trash2, AlertCircle, Clock, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { NotificationType, Notification } from '../types';

const PanelContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  max-height: 500px;
  overflow-y: auto;
  position: relative;
  direction: rtl;
`;

const PanelHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const NotificationList = styled.div`
  padding: 8px 0;
`;

const NotificationItem = styled.div<{ $isRead: boolean }>`
  padding: 12px 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isRead ? '#f9fafb' : 'white'};
  
  &:hover {
    background: #f3f4f6;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const NotificationMain = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h4<{ $isRead: boolean }>`
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: ${props => props.$isRead ? '500' : '600'};
  color: ${props => props.$isRead ? '#6b7280' : '#111827'};
  line-height: 1.4;
`;

const NotificationMessage = styled.p<{ $isRead: boolean }>`
  margin: 0 0 8px 0;
  font-size: 13px;
  color: ${props => props.$isRead ? '#9ca3af' : '#4b5563'};
  line-height: 1.4;
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const NotificationTime = styled.span`
  font-size: 11px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NotificationIcon = styled.div<{ $type: NotificationType }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$type) {
      case 'transfer_request': return '#fef3c7';
      case 'transfer_approved': return '#d1fae5';
      case 'transfer_rejected': return '#fee2e2';
      case 'doctor_added': return '#dbeafe';
      case 'general': return '#fde68a';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'transfer_request': return '#d97706';
      case 'transfer_approved': return '#059669';
      case 'transfer_rejected': return '#dc2626';
      case 'doctor_added': return '#2563eb';
      case 'general': return '#d97706';
      default: return '#6b7280';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  
  .icon {
    margin-bottom: 12px;
    color: #d1d5db;
  }
`;

const UnreadBadge = styled.span`
  background: #ef4444;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  direction: rtl;
`;

const ModalHeader = styled.div<{ $type: NotificationType }>`
  padding: 24px;
  background: ${props => {
    switch (props.$type) {
      case 'transfer_request': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'transfer_approved': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'transfer_rejected': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'doctor_added': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }};
  color: white;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const ModalHeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ModalIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ModalHeaderText = styled.div`
  flex: 1;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 13px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 32px 24px;
`;

const ModalMessage = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border-right: 4px solid #667eea;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 0 24px 24px;
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover {
            background: #e5e7eb;
          }
        `;
    }
  }}
`;

interface NotificationPanelProps {}

const NotificationPanel: React.FC<NotificationPanelProps> = () => {
  const context = useAppContext();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  if (!context) {
    return null;
  }

  const { state, markNotificationAsRead, deleteNotification } = context;
  const { notifications, currentUser } = state;

  // تصفية الإشعارات للمستخدم الحالي
  const userNotifications = notifications.filter(
    notification => !notification.recipientId || notification.recipientId === currentUser?.id
  );

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const formatTime = (date: any) => {
    if (!date) return 'الآن';
    
    try {
      const now = new Date();
      let dateObj: Date;
      
      // محاولة تحويل التاريخ بطرق مختلفة
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (typeof date === 'number') {
        dateObj = new Date(date);
      } else if (date && typeof date === 'object' && date.$date) {
        // MongoDB format
        dateObj = new Date(date.$date);
      } else {
        console.warn('Unknown date format:', date);
        return 'الآن';
      }
      
      // تحقق من صحة التاريخ
      if (!dateObj || isNaN(dateObj.getTime())) {
        console.warn('Invalid date:', date);
        return 'الآن';
      }
      
      const diff = now.getTime() - dateObj.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'الآن';
      if (minutes < 60) return `منذ ${minutes} دقيقة`;
      if (hours < 24) return `منذ ${hours} ساعة`;
      return `منذ ${days} يوم`;
    } catch (error) {
      console.error('Error formatting time:', error, 'Date:', date);
      return 'الآن';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'transfer_request':
        return <AlertCircle size={16} />;
      case 'transfer_approved':
        return <Check size={16} />;
      case 'transfer_rejected':
        return <Trash2 size={16} />;
      case 'doctor_added':
        return <Bell size={16} />;
      case 'general':
        return <AlertCircle size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const handleMarkAsRead = (notificationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markNotificationAsRead(notificationId);
  };

  const handleDelete = (notificationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    deleteNotification(notificationId);
    setSelectedNotification(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <h3>
          <Bell size={18} />
          الإشعارات
          {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
        </h3>
      </PanelHeader>

      <NotificationList>
        {userNotifications.length === 0 ? (
          <EmptyState>
            <Bell size={48} className="icon" />
            <p>لا توجد إشعارات جديدة</p>
          </EmptyState>
        ) : (
          userNotifications
            .sort((a, b) => {
              try {
                const getTime = (date: any): number => {
                  if (!date) return 0;
                  if (date instanceof Date) return date.getTime();
                  if (typeof date === 'string') return new Date(date).getTime();
                  if (typeof date === 'number') return date;
                  if (date.$date) return new Date(date.$date).getTime();
                  return 0;
                };
                
                const timeA = getTime(a.createdAt);
                const timeB = getTime(b.createdAt);
                
                return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
              } catch (error) {
                console.error('Error sorting notifications:', error);
                return 0;
              }
            })
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                $isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationContent>
                  <NotificationIcon $type={notification.type}>
                    {getNotificationIcon(notification.type)}
                  </NotificationIcon>
                  
                  <NotificationMain>
                    <NotificationTitle $isRead={notification.isRead}>
                      {notification.title}
                    </NotificationTitle>
                    <NotificationMessage $isRead={notification.isRead}>
                      {notification.message}
                    </NotificationMessage>
                    <NotificationMeta>
                      <NotificationTime>
                        <Clock size={12} />
                        {formatTime(notification.createdAt)}
                      </NotificationTime>
                    </NotificationMeta>
                  </NotificationMain>

                  <ActionButtons>
                    {[
                      !notification.isRead && (
                        <ActionButton
                          key="mark-read"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          title="تعيين كمقروء"
                        >
                          <Check size={14} />
                        </ActionButton>
                      ),
                      <ActionButton
                        key="delete"
                        onClick={(e) => handleDelete(notification.id, e)}
                        title="حذف الإشعار"
                      >
                        <Trash2 size={14} />
                      </ActionButton>
                    ].filter(Boolean)}
                  </ActionButtons>
                </NotificationContent>
              </NotificationItem>
            ))
        )}
      </NotificationList>

      {selectedNotification && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader $type={selectedNotification.type}>
              <ModalHeaderContent>
                <ModalIconWrapper>
                  {getNotificationIcon(selectedNotification.type)}
                </ModalIconWrapper>
                <ModalHeaderText>
                  <h2>{selectedNotification.title}</h2>
                  <p>
                    <Clock size={14} />
                    {formatTime(selectedNotification.createdAt)}
                  </p>
                </ModalHeaderText>
              </ModalHeaderContent>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <ModalMessage>
                {selectedNotification.message}
              </ModalMessage>
            </ModalBody>

            <ModalActions>
              {!selectedNotification.isRead && (
                <ModalButton
                  $variant="primary"
                  onClick={() => handleMarkAsRead(selectedNotification.id)}
                >
                  <Check size={16} />
                  تعيين كمقروء
                </ModalButton>
              )}
              <ModalButton
                $variant="danger"
                onClick={() => handleDelete(selectedNotification.id)}
              >
                <Trash2 size={16} />
                حذف الإشعار
              </ModalButton>
              <ModalButton onClick={handleCloseModal}>
                إغلاق
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </PanelContainer>
  );
};

export default NotificationPanel;