/* ============================================
   GymForge PRO — User History Module
   Timeline view, activity filtering, export
   ============================================ */

const UserHistory = {
    currentFilter: 'all',

    categoryIcons: {
        auth: '🔑', attendance: '📍', workout: '💪', nutrition: '🥗',
        payment: '💳', chat: '🤖', profile: '👤', challenge: '🏆',
        subscription: '📋', admin: '⚙️', other: '📌'
    },

    categoryColors: {
        auth: '#3b82f6', attendance: '#22c55e', workout: '#f97316', nutrition: '#eab308',
        payment: '#a855f7', chat: '#06b6d4', profile: '#64748b', challenge: '#ec4899',
        subscription: '#14b8a6', admin: '#ef4444', other: '#6b7280'
    },

    async render() {
        const s = document.getElementById('section-u-history');
        if (!s) return;
        const userId = Auth.currentUser?.id;

        let activities = [];

        // Try API first, fallback to localStorage
        const backendAvailable = await ApiClient.checkBackend();
        if (backendAvailable && userId) {
            try {
                const typeParam = this.currentFilter !== 'all' ? this.currentFilter : undefined;
                const data = await ApiClient.getHistory(userId, typeParam);
                activities = data.activities || [];
            } catch (e) {
                activities = this.getLocalActivities();
            }
        } else {
            activities = this.getLocalActivities();
        }

        const categories = ['all', 'auth', 'attendance', 'workout', 'nutrition', 'payment', 'chat', 'profile'];

        s.innerHTML = `
            <div class="section-header">
                <h1>Activity History</h1>
                <p class="section-subtitle">Track all your activity across GymForge Pro</p>
            </div>

            <div class="history-controls">
                <div class="history-filter-bar">
                    ${categories.map(c => `
                        <button class="history-filter-btn ${this.currentFilter === c ? 'active' : ''}" 
                                onclick="UserHistory.filter('${c}')"
                                style="${this.currentFilter === c ? `background:${this.categoryColors[c] || 'var(--accent)'}20;color:${this.categoryColors[c] || 'var(--accent)'}; border-color:${this.categoryColors[c] || 'var(--accent)'}` : ''}">
                            ${c === 'all' ? '📊 All' : `${this.categoryIcons[c]} ${c.charAt(0).toUpperCase() + c.slice(1)}`}
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-ghost btn-sm" onclick="UserHistory.exportHistory()">📤 Export</button>
            </div>

            <div class="history-timeline">
                ${activities.length === 0 ? `
                    <div class="history-empty">
                        <span class="history-empty-icon">📭</span>
                        <p>No activity recorded yet</p>
                    </div>
                ` : activities.map((a, i) => {
            const cat = a.category || 'other';
            const color = this.categoryColors[cat] || '#6b7280';
            const icon = this.categoryIcons[cat] || '📌';
            const time = this.formatTime(a.created_at);
            return `
                        <div class="history-item" style="--delay:${i * 0.05}s;animation-delay:${i * 0.05}s">
                            <div class="history-dot" style="background:${color}"></div>
                            <div class="history-line"></div>
                            <div class="history-card">
                                <div class="history-card-header">
                                    <span class="history-card-icon" style="background:${color}20;color:${color}">${icon}</span>
                                    <div class="history-card-info">
                                        <span class="history-action">${a.action}</span>
                                        <span class="history-time">${time}</span>
                                    </div>
                                    <span class="history-cat-badge" style="background:${color}15;color:${color}">${cat}</span>
                                </div>
                                ${a.details && Object.keys(a.details).length > 0 ? `
                                    <div class="history-details">${Object.entries(a.details).map(([k, v]) =>
                `<span class="history-detail-item"><strong>${k}:</strong> ${v}</span>`
            ).join('')}</div>
                                ` : ''}
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    filter(cat) {
        this.currentFilter = cat;
        this.render();
    },

    getLocalActivities() {
        // Generate from localStorage data
        const activities = [];
        const user = Auth.currentUser;
        if (!user) return activities;

        // Login records
        if (user.last_login || user.lastLogin) {
            activities.push({ action: 'User logged in', category: 'auth', created_at: user.last_login || new Date().toISOString(), details: {} });
        }

        // Attendance from localStorage
        const att = Store.getA('attendance');
        att.filter(a => a.mId === user.id).slice(-10).forEach(a => {
            activities.push({ action: 'Gym check-in', category: 'attendance', created_at: a.time, details: { method: 'QR Code' } });
        });

        // Sort by date desc
        activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return activities;
    },

    formatTime(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        const now = new Date();
        const diff = now - d;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    exportHistory() {
        showToast('Export feature — generates PDF-ready HTML structure', 'info');
        // In production, this would generate a downloadable PDF
    }
};
