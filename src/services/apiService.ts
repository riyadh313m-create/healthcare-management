const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'خطأ في الخادم' }));
        
        // إذا كان الخطأ 401 (Unauthorized)، احذف token ووجه للـ login
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          // يمكن إضافة redirect للـ login page هنا إذا لزم الأمر
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Hospital methods
  async getHospitals() {
    return this.request<any[]>('/hospitals');
  }

  async getHospital(id: string) {
    return this.request<any>(`/hospitals/${id}`);
  }

  async createHospital(hospital: any) {
    return this.request<any>('/hospitals', {
      method: 'POST',
      body: JSON.stringify(hospital),
    });
  }

  async updateHospital(id: string, hospital: any) {
    return this.request<any>(`/hospitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hospital),
    });
  }

  async deleteHospital(id: string) {
    return this.request<any>(`/hospitals/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctor methods
  async getDoctors(filters?: { hospitalId?: string; specialization?: string; status?: string; isArchived?: boolean }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/doctors${query}`);
  }

  async getDoctor(id: string) {
    return this.request<any>(`/doctors/${id}`);
  }

  async createDoctor(doctor: any) {
    return this.request<any>('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    });
  }

  async updateDoctor(id: string, doctor: any) {
    return this.request<any>(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    });
  }

  async archiveDoctor(id: string) {
    return this.request<any>(`/doctors/${id}/archive`, {
      method: 'PATCH',
    });
  }

  // User methods
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(user: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Transfer methods
  async getTransfers(filters?: { status?: string; doctorId?: string; hospitalId?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/transfers${query}`);
  }

  async createTransfer(transfer: any) {
    return this.request<any>('/transfers', {
      method: 'POST',
      body: JSON.stringify(transfer),
    });
  }

  async updateTransferStatus(id: string, status: 'approved' | 'rejected', rejectionReason?: string) {
    return this.request<any>(`/transfers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  // Notification methods
  async getNotifications(filters?: { isRead?: boolean; limit?: number; page?: number }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ notifications: any[]; total: number; currentPage: number; totalPages: number }>(`/notifications${query}`);
  }

  async createNotification(notification: any) {
    return this.request<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async deleteNotification(id: string) {
    return this.request<any>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async getUnreadNotificationCount() {
    return this.request<{ count: number }>('/notifications/unread/count');
  }

  // History methods
  async getHistory(filters?: { 
    action?: string; 
    targetType?: string; 
    targetId?: string; 
    startDate?: string; 
    endDate?: string;
    limit?: number;
    page?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ history: any[]; total: number; currentPage: number; totalPages: number }>(`/history${query}`);
  }

  async createHistoryRecord(record: any) {
    return this.request<any>('/history', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async getHistoryStats(filters?: { startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ stats: any[]; totalRecords: number }>(`/history/stats${query}`);
  }
}

export const apiService = new ApiService();
export default apiService;