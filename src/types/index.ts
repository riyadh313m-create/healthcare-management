// الأنواع الأساسية للنظام

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  type: 'hospital' | 'health_center';
  requiredDoctors: number;
  currentDoctors: number;
  headOfDoctors?: User;
  specializationRequirements?: Record<string, number>;
}

export interface Doctor {
  id: string;
  fullName: string;
  phone?: string;
  jobTitle: JobTitle;
  graduationYear: number;
  originalHospital: string; // الملاك
  currentHospital: string; // الدوام الحالي
  specialization: string;
  status: DoctorStatus;
  gender: 'male' | 'female';
  startDate: Date;
  workDuration?: string; // محسوبة
  isArchived: boolean; // للدراسات
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone: string;
  jobTitle: string;
  hospitalId?: string; // للـ head_of_doctors
}

export interface Transfer {
  id: string;
  doctorId: string;
  fromHospitalId: string;
  toHospitalId: string;
  requestDate: Date;
  transferDate?: Date;
  status: TransferStatus;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

export interface HistoryRecord {
  id: string;
  action: ActionType;
  performedBy: string;
  targetId: string;
  targetType: 'doctor' | 'hospital' | 'transfer' | 'user';
  details: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string; // معرف المستلم
  isRead: boolean;
  relatedId?: string; // معرف العنصر المرتبط (طلب النقل مثلاً)
  createdAt: Date;
}

// التعدادات (Enums)
export type JobTitle = 
  | 'اخصائي'
  | 'مقيم اقدم'
  | 'تدرج'
  | 'مقيم دوري'
  | 'طبيب عام'
  | 'طبيب اختصاص'
  | 'طبيب استشاري'
  | 'طبيب مقيم'
  | 'رئيس أطباء'
  | 'نائب رئيس أطباء';

export type DoctorStatus = 
  | 'مستمر بالدوام'
  | 'اجازة مرضية'
  | 'اجازة امومة'
  | 'اجازة طويلة';

export type UserRole = 
  | 'chief_of_doctors' // رئيس الأطباء العموم
  | 'head_of_doctors'; // رئيس أطباء المستشفى

export type TransferStatus = 
  | 'pending' // في الانتظار
  | 'approved' // موافق عليه
  | 'rejected' // مرفوض
  | 'completed'; // مكتمل

export type NotificationType = 
  | 'transfer_request' // طلب نقل
  | 'transfer_approved' // موافقة على النقل
  | 'transfer_rejected' // رفض النقل
  | 'doctor_added' // إضافة طبيب جديد
  | 'general'; // إشعار عام

export type ActionType = 
  | 'doctor_added'
  | 'doctor_transferred'
  | 'doctor_archived'
  | 'doctor_updated'
  | 'hospital_added'
  | 'hospital_updated'
  | 'user_added'
  | 'user_updated'
  | 'transfer_requested'
  | 'transfer_approved'
  | 'transfer_rejected';

// واجهات للمرشحات والبحث
export interface DoctorFilter {
  jobTitle?: JobTitle;
  specialization?: string;
  status?: DoctorStatus;
  hospitalId?: string;
}

export interface TransferFilter {
  fromHospitalId?: string;
  toHospitalId?: string;
  jobTitle?: JobTitle;
  specialization?: string;
}