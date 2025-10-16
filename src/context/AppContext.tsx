import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/apiService';
import type { 
  Hospital, 
  Doctor, 
  User, 
  Transfer, 
  HistoryRecord,
  Notification,
  NotificationType
} from '../types';

// الحالة الأولية للنظام
interface AppState {
  hospitals: Hospital[];
  doctors: Doctor[];
  users: User[];
  transfers: Transfer[];
  history: HistoryRecord[];
  notifications: Notification[];
  currentUser: User | null;
  isAuthenticated: boolean;
}

// الأفعال المتاحة
type AppAction = 
  | { type: 'SET_HOSPITALS'; payload: Hospital[] }
  | { type: 'ADD_HOSPITAL'; payload: Hospital }
  | { type: 'UPDATE_HOSPITAL'; payload: Hospital }
  | { type: 'SET_DOCTORS'; payload: Doctor[] }
  | { type: 'ADD_DOCTOR'; payload: Doctor }
  | { type: 'UPDATE_DOCTOR'; payload: Doctor }
  | { type: 'ARCHIVE_DOCTOR'; payload: string }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_TRANSFERS'; payload: Transfer[] }
  | { type: 'ADD_TRANSFER'; payload: Transfer }
  | { type: 'UPDATE_TRANSFER'; payload: Transfer }
  | { type: 'SET_HISTORY'; payload: HistoryRecord[] }
  | { type: 'ADD_HISTORY'; payload: HistoryRecord }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  hospitals: [],
  doctors: [],
  users: [],
  transfers: [],
  history: [],
  notifications: [],
  currentUser: null,
  isAuthenticated: false
};

// المُحَدِّد (Reducer)
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_HOSPITALS':
      return { ...state, hospitals: action.payload };
    
    case 'ADD_HOSPITAL':
      return { ...state, hospitals: [...state.hospitals, action.payload] };
    
    case 'UPDATE_HOSPITAL':
      return {
        ...state,
        hospitals: state.hospitals.map(h => 
          h.id === action.payload.id ? action.payload : h
        )
      };
    
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    
    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, action.payload] };
    
    case 'UPDATE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.map(d => 
          d.id === action.payload.id ? action.payload : d
        )
      };
    
    case 'ARCHIVE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.map(d => 
          d.id === action.payload ? { ...d, isArchived: true } : d
        )
      };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => 
          u.id === action.payload.id ? action.payload : u
        )
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload)
      };
    
    case 'SET_TRANSFERS':
      return { ...state, transfers: action.payload };
    
    case 'ADD_TRANSFER':
      return { ...state, transfers: [...state.transfers, action.payload] };
    
    case 'UPDATE_TRANSFER':
      return {
        ...state,
        transfers: state.transfers.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    
    case 'ADD_HISTORY':
      return { ...state, history: [...state.history, action.payload] };

    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        )
      };

    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'LOGIN':
      return { 
        ...state, 
        currentUser: action.payload, 
        isAuthenticated: true 
      };
    
    case 'LOGOUT':
      return { 
        ...state, 
        currentUser: null, 
        isAuthenticated: false 
      };
    
    default:
      return state;
  }
}

// السياق
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addHistoryRecord: (action: string, details: string, targetId: string, targetType: string) => Promise<void>;
  addNotification: (type: NotificationType, title: string, message: string, recipientId?: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
} | null>(null);

// مزود السياق
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // تحميل البيانات الأولية
  useEffect(() => {
    // تحقق من وجود token مخزن
    const token = localStorage.getItem('authToken');
    if (token) {
      // محاولة استرداد بيانات المستخدم الحالي
      loadCurrentUser();
    } else {
      // إذا لم يكن هناك token، تأكد من تنظيف localStorage
      localStorage.clear();
      loadInitialData();
    }
  }, []);

  // تحميل المستخدم الحالي من API
  const loadCurrentUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      const user = {
        ...response.user,
        hospitalId: response.user.hospitalId?._id || response.user.hospitalId
      };
      dispatch({ type: 'LOGIN', payload: user });
      await loadDataFromAPI();
    } catch (error) {
      console.error('Failed to load current user:', error);
      localStorage.removeItem('authToken');
      loadInitialData();
    }
  };

  // تحميل البيانات من API
  const loadDataFromAPI = async () => {
    try {
      // تحميل المستشفيات
      const hospitalsData = await apiService.getHospitals();
      // تحويل _id إلى id
      const hospitals = hospitalsData.map((h: any) => ({ ...h, id: h._id }));
      dispatch({ type: 'SET_HOSPITALS', payload: hospitals });

      // تحميل الأطباء
      const doctorsData = await apiService.getDoctors();
      // تحويل _id إلى id و hospital ObjectIds
      const doctors = doctorsData.map((d: any) => ({
        ...d,
        id: d._id,
        originalHospital: d.originalHospital?._id || d.originalHospital,
        currentHospital: d.currentHospital?._id || d.currentHospital
      }));
      dispatch({ type: 'SET_DOCTORS', payload: doctors });

      // تحميل التحويلات
      const transfersData = await apiService.getTransfers();
      // تحويل _id إلى id و populate ObjectIds
      const transfers = transfersData.map((t: any) => ({
        ...t,
        id: t._id,
        doctorId: t.doctorId?._id || t.doctorId,
        fromHospitalId: t.fromHospitalId?._id || t.fromHospitalId,
        toHospitalId: t.toHospitalId?._id || t.toHospitalId,
        requestedBy: t.requestedBy?._id || t.requestedBy,
        approvedBy: t.approvedBy?._id || t.approvedBy
      }));
      dispatch({ type: 'SET_TRANSFERS', payload: transfers });

      // تحميل الإشعارات
      const notifications = await apiService.getNotifications();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications.notifications });

      // تحميل التاريخ
      const history = await apiService.getHistory();
      dispatch({ type: 'SET_HISTORY', payload: history.history });

    } catch (error) {
      console.error('Failed to load data from API:', error);
    }
  };

  // تسجيل الدخول
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(username, password);
      const user = {
        ...response.user,
        hospitalId: response.user.hospitalId?._id || response.user.hospitalId
      };
      
      dispatch({ type: 'LOGIN', payload: user });
      
      // تحميل البيانات بعد تسجيل الدخول
      await loadDataFromAPI();
      
      addHistoryRecord('user_login', `تسجيل دخول للمستخدم ${user.fullName}`, user.id, 'user');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // تسجيل الخروج
  const logout = () => {
    if (state.currentUser) {
      addHistoryRecord('user_logout', `تسجيل خروج للمستخدم ${state.currentUser.fullName}`, state.currentUser.id, 'user');
    }
    dispatch({ type: 'LOGOUT' });
  };

  // إضافة سجل تاريخي
  const addHistoryRecord = async (action: string, details: string, targetId: string, targetType: string) => {
    try {
      const historyRecord = await apiService.createHistoryRecord({
        action,
        performedBy: state.currentUser?.fullName || 'System',
        targetId,
        targetType,
        details
      });
      dispatch({ type: 'ADD_HISTORY', payload: historyRecord });
    } catch (error) {
      console.error('Failed to add history record:', error);
      // fallback للسجل المحلي
      const historyRecord: HistoryRecord = {
        id: Date.now().toString(),
        action: action as any,
        performedBy: state.currentUser?.fullName || 'System',
        targetId,
        targetType: targetType as any,
        details,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_HISTORY', payload: historyRecord });
    }
  };

  // تحميل البيانات الأولية (بيانات فارغة - سيتم تحميل البيانات من API)
  const loadInitialData = () => {
    // بدء بحالة فارغة - البيانات ستأتي من API
    dispatch({ type: 'SET_HOSPITALS', payload: [] });
    dispatch({ type: 'SET_USERS', payload: [] });
    dispatch({ type: 'SET_DOCTORS', payload: [] });
    dispatch({ type: 'SET_TRANSFERS', payload: [] });
    dispatch({ type: 'SET_HISTORY', payload: [] });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
  };

  // إضافة إشعار جديد
  const addNotification = async (type: NotificationType, title: string, message: string, recipientId?: string) => {
    try {
      const notification = await apiService.createNotification({
        type,
        title,
        message,
        recipientId
      });
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    } catch (error) {
      console.error('Failed to add notification:', error);
      // fallback للإشعار المحلي
      const notification: Notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        recipientId: recipientId || '',
        isRead: false,
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    }
  };

  // تعيين إشعار كمقروء
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationRead(notificationId);
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    }
  };

  // حذف إشعار
  const deleteNotification = async (notificationId: string) => {
    try {
      await apiService.deleteNotification(notificationId);
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    }
  };

  const value = {
    state,
    dispatch,
    login,
    logout,
    addHistoryRecord,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// هوك لاستخدام السياق
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}