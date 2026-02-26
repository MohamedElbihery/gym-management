/* ============================================
   GymForge PRO — Frontend API Client
   JWT Authentication, Backend Integration
   Falls back to localStorage when offline
   ============================================ */

const ApiClient = {
    baseURL: (typeof window !== 'undefined' && window.GYMFORGE_API_URL) || '/api',
    _accessToken: null,
    _refreshToken: null,

    get accessToken() {
        if (!this._accessToken) this._accessToken = localStorage.getItem('gfp_access_token');
        return this._accessToken;
    },
    set accessToken(v) {
        this._accessToken = v;
        if (v) localStorage.setItem('gfp_access_token', v);
        else localStorage.removeItem('gfp_access_token');
    },

    get refreshToken() {
        if (!this._refreshToken) this._refreshToken = localStorage.getItem('gfp_refresh_token');
        return this._refreshToken;
    },
    set refreshToken(v) {
        this._refreshToken = v;
        if (v) localStorage.setItem('gfp_refresh_token', v);
        else localStorage.removeItem('gfp_refresh_token');
    },

    isBackendAvailable: null,

    async checkBackend() {
        if (this.isBackendAvailable !== null) return this.isBackendAvailable;
        try {
            const res = await fetch(`${this.baseURL}/health`, { signal: AbortSignal.timeout(2000) });
            this.isBackendAvailable = res.ok;
        } catch (e) {
            this.isBackendAvailable = false;
        }
        return this.isBackendAvailable;
    },

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        try {
            let res = await fetch(url, { ...options, headers, body: options.body ? JSON.stringify(options.body) : undefined });

            // Token expired — try refresh
            if (res.status === 401) {
                const data = await res.json();
                if (data.code === 'TOKEN_EXPIRED' && this.refreshToken) {
                    const refreshed = await this.doRefresh();
                    if (refreshed) {
                        headers['Authorization'] = `Bearer ${this.accessToken}`;
                        res = await fetch(url, { ...options, headers, body: options.body ? JSON.stringify(options.body) : undefined });
                    }
                }
            }

            const json = await res.json();
            if (!res.ok) throw { status: res.status, ...json };
            return json;
        } catch (err) {
            if (err.status) throw err;
            console.error(`Fetch failed for ${url}:`, err);
            throw { status: 0, error: `Network error (Failed to reach ${this.baseURL})`, offline: true, target: url };
        }
    },

    async doRefresh() {
        try {
            const res = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken }),
            });
            if (!res.ok) {
                this.clearTokens();
                return false;
            }
            const data = await res.json();
            this.accessToken = data.accessToken;
            this.refreshToken = data.refreshToken;
            return true;
        } catch (e) {
            this.clearTokens();
            return false;
        }
    },

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
    },

    // ==================== AUTH API ====================
    async login(email, password) {
        const data = await this.request('/auth/login', { method: 'POST', body: { email, password } });
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        return data;
    },

    async register(userData) {
        return this.request('/auth/register', { method: 'POST', body: userData });
    },

    async verifyOTP(email, code) {
        const data = await this.request('/auth/verify-otp', { method: 'POST', body: { email, code } });
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        return data;
    },

    async resendOTP(email) {
        return this.request('/auth/resend-otp', { method: 'POST', body: { email } });
    },

    async getMe() {
        return this.request('/auth/me');
    },

    // ==================== USER API ====================
    async getProfile(userId) { return this.request(`/users/${userId}/profile`); },
    async updateProfile(userId, data) { return this.request(`/users/${userId}/profile`, { method: 'PUT', body: data }); },
    async getHistory(userId, type) { return this.request(`/users/${userId}/history${type ? `?type=${type}` : ''}`); },
    async getAttendance(userId) { return this.request(`/users/${userId}/attendance`); },
    async checkIn(userId, method) { return this.request(`/users/${userId}/attendance`, { method: 'POST', body: { method } }); },
    async getWorkouts(userId) { return this.request(`/users/${userId}/workouts`); },
    async saveWorkout(userId, planData) { return this.request(`/users/${userId}/workouts`, { method: 'POST', body: { plan_data: planData } }); },
    async getNutrition(userId) { return this.request(`/users/${userId}/nutrition`); },
    async logNutrition(userId, data) { return this.request(`/users/${userId}/nutrition`, { method: 'POST', body: data }); },
    async getPayments(userId) { return this.request(`/users/${userId}/payments`); },
    async getChatHistory(userId) { return this.request(`/users/${userId}/chat`); },
    async saveChatMessage(userId, msg) { return this.request(`/users/${userId}/chat`, { method: 'POST', body: msg }); },
    async clearChat(userId) { return this.request(`/users/${userId}/chat`, { method: 'DELETE' }); },
    async getNotifications(userId) { return this.request(`/users/${userId}/notifications`); },
    async markNotificationsRead(userId) { return this.request(`/users/${userId}/notifications/read`, { method: 'PUT' }); },

    // ==================== ADMIN API ====================
    async getAdminUsers(params) { return this.request(`/admin/users?${new URLSearchParams(params)}`); },
    async getAdminStats() { return this.request('/admin/stats'); },
    async createAdminUser(data) { return this.request('/admin/users', { method: 'POST', body: data }); },
    async updateUserRole(userId, role) { return this.request(`/admin/users/${userId}/role`, { method: 'PUT', body: { role } }); },
    async deleteUser(userId) { return this.request(`/admin/users/${userId}`, { method: 'DELETE' }); },

    // Logout
    logout() {
        this.clearTokens();
        localStorage.removeItem('gfp_user');
    }
};
