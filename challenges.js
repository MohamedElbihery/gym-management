/* ============================================
   GymForge PRO — Community Challenges
   Seasonal Challenges, Leaderboards, XP,
   Badges, Countdown, Rewards
   ============================================ */

const ChallengeSystem = {
    // Pre-seeded challenges
    defaultChallenges: [
        {
            id: 'CH001', name: 'Spring Steps Challenge', type: 'steps', icon: '🚶',
            description: 'Walk 100,000 steps this month to earn exclusive rewards!',
            goal: 100000, unit: 'steps', xpReward: 500,
            startDate: new Date(Date.now() - 10 * 86400000).toISOString(),
            endDate: new Date(Date.now() + 20 * 86400000).toISOString(),
            badge: { name: 'Step Master', emoji: '🚶', color: '#22c55e' },
            season: 'spring'
        },
        {
            id: 'CH002', name: 'Summer Strength Showdown', type: 'workouts', icon: '💪',
            description: 'Complete 20 workouts this month. Push your limits!',
            goal: 20, unit: 'workouts', xpReward: 750,
            startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
            endDate: new Date(Date.now() + 25 * 86400000).toISOString(),
            badge: { name: 'Iron Warrior', emoji: '⚔️', color: '#f97316' },
            season: 'summer'
        },
        {
            id: 'CH003', name: 'Calorie Crusher', type: 'calories', icon: '🔥',
            description: 'Burn 50,000 calories this month through any activity!',
            goal: 50000, unit: 'kcal', xpReward: 600,
            startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
            endDate: new Date(Date.now() + 27 * 86400000).toISOString(),
            badge: { name: 'Calorie King', emoji: '🔥', color: '#ef4444' },
            season: 'summer'
        },
        {
            id: 'CH004', name: 'Streak Champion', type: 'streak', icon: '🔥',
            description: 'Maintain a 14-day consecutive check-in streak!',
            goal: 14, unit: 'days', xpReward: 400,
            startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
            endDate: new Date(Date.now() + 21 * 86400000).toISOString(),
            badge: { name: 'Streak Legend', emoji: '🔥', color: '#eab308' },
            season: 'all'
        },
        {
            id: 'CH005', name: 'XP Domination', type: 'xp', icon: '⭐',
            description: 'Earn 2,000 XP this month from all activities!',
            goal: 2000, unit: 'XP', xpReward: 300,
            startDate: new Date(Date.now() - 8 * 86400000).toISOString(),
            endDate: new Date(Date.now() + 22 * 86400000).toISOString(),
            badge: { name: 'XP Hunter', emoji: '⭐', color: '#a855f7' },
            season: 'all'
        },
    ],

    // Badge definitions
    badges: [
        { id: 'B001', name: 'First Steps', emoji: '👶', description: 'Complete your first challenge', color: '#3b82f6' },
        { id: 'B002', name: 'Step Master', emoji: '🚶', description: 'Walk 100,000 steps in a month', color: '#22c55e' },
        { id: 'B003', name: 'Iron Warrior', emoji: '⚔️', description: 'Complete 20 workouts in a month', color: '#f97316' },
        { id: 'B004', name: 'Calorie King', emoji: '🔥', description: 'Burn 50,000 calories in a month', color: '#ef4444' },
        { id: 'B005', name: 'Streak Legend', emoji: '🔥', description: '14-day check-in streak', color: '#eab308' },
        { id: 'B006', name: 'XP Hunter', emoji: '⭐', description: 'Earn 2,000 XP in a month', color: '#a855f7' },
        { id: 'B007', name: 'Team Player', emoji: '🤝', description: 'Join 3 challenges', color: '#06b6d4' },
        { id: 'B008', name: 'Champion', emoji: '🏆', description: 'Finish top 3 in any challenge', color: '#f97316' },
    ],

    init() {
        // Seed challenges if not exists
        let challenges = Store.getA('challenges');
        if (challenges.length === 0) {
            Store.set('challenges', this.defaultChallenges);
        }
    },

    getChallenges() {
        let c = Store.getA('challenges');
        if (c.length === 0) { this.init(); c = Store.getA('challenges'); }
        return c;
    },

    getParticipation(userId) {
        return Store.getA('challenge_participation').filter(p => p.userId === userId);
    },

    isJoined(challengeId, userId) {
        return this.getParticipation(userId).some(p => p.challengeId === challengeId);
    },

    joinChallenge(challengeId) {
        if (!Auth.currentUser) return;
        const parts = Store.getA('challenge_participation');
        if (parts.some(p => p.challengeId === challengeId && p.userId === Auth.currentUser.id)) {
            showToast(I18n.t('challenges.alreadyJoined'), 'info');
            return;
        }
        parts.push({
            challengeId,
            userId: Auth.currentUser.id,
            userName: Auth.currentUser.name,
            joinedAt: new Date().toISOString(),
            progress: Math.round(Math.random() * 40), // Simulate some existing progress
        });
        Store.set('challenge_participation', parts);

        // Check badge unlock: Team Player
        const userParts = parts.filter(p => p.userId === Auth.currentUser.id);
        if (userParts.length >= 3) this.unlockBadge('B007');

        Gamification.addXP(Auth.currentUser.id, 25, 'Joined challenge');
        showToast(I18n.t('challenges.joinedSuccess'), 'success');
        this.renderChallenges();
    },

    leaveChallenge(challengeId) {
        if (!Auth.currentUser) return;
        let parts = Store.getA('challenge_participation');
        parts = parts.filter(p => !(p.challengeId === challengeId && p.userId === Auth.currentUser.id));
        Store.set('challenge_participation', parts);
        showToast(I18n.t('challenges.leftSuccess'), 'info');
        this.renderChallenges();
    },

    getMemberProgress(challengeId, userId) {
        const parts = Store.getA('challenge_participation');
        const p = parts.find(pp => pp.challengeId === challengeId && pp.userId === userId);
        return p ? p.progress : 0;
    },

    getChallengeLeaderboard(challengeId) {
        const parts = Store.getA('challenge_participation').filter(p => p.challengeId === challengeId);
        // Simulate progress for demo members
        const members = Auth.getMembers();
        const lb = parts.map(p => {
            const member = members.find(m => m.id === p.userId) || Auth.currentUser;
            const challenge = this.getChallenges().find(c => c.id === challengeId);
            // Simulate progress: mix of stored + random delta
            const progress = Math.min(challenge?.goal || 100, p.progress + Math.round(Math.random() * (challenge?.goal || 100) * 0.3));
            return {
                userId: p.userId,
                name: member?.name || p.userName || 'Unknown',
                progress,
                pct: Math.round((progress / (challenge?.goal || 1)) * 100),
                xp: member?.xp || 0,
            };
        }).sort((a, b) => b.progress - a.progress);
        return lb;
    },

    getCountdown(endDate) {
        const diff = new Date(endDate).getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return { days, hours, minutes, expired: false };
    },

    getUserBadges(userId) {
        return Store.getA(`badges_${userId}`);
    },

    unlockBadge(badgeId) {
        if (!Auth.currentUser) return;
        const badges = Store.getA(`badges_${Auth.currentUser.id}`);
        if (badges.includes(badgeId)) return;
        badges.push(badgeId);
        Store.set(`badges_${Auth.currentUser.id}`, badges);
        const badge = this.badges.find(b => b.id === badgeId);
        if (badge) {
            Notifs.push(I18n.t('challenges.badgeUnlockedTitle'), I18n.t('challenges.badgeUnlockedMsg', [badge.name, badge.emoji]), 'success');
            showToast(I18n.t('challenges.badgeUnlockedMsg', [badge.name, badge.emoji]), 'success');
        }
    },

    // ==================== USER RENDER ====================
    renderChallenges() {
        const s = document.getElementById('section-u-challenges');
        if (!s) return;
        const challenges = this.getChallenges();
        const now = Date.now();
        const active = challenges.filter(c => new Date(c.endDate).getTime() > now);
        const userId = Auth.currentUser?.id;
        const userBadges = this.getUserBadges(userId);
        const colors = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#06b6d4'];

        // Seed participation for demo members
        this.seedDemoParticipation();

        s.innerHTML = `
            <div class="section-header"><h1>${I18n.t('challenges.title')}</h1><p class="section-subtitle">${I18n.t('challenges.subtitle')}</p></div>

            <!-- Active Challenges -->
            <div class="challenges-grid">
                ${active.map((c, i) => {
            const joined = this.isJoined(c.id, userId);
            const progress = joined ? this.getMemberProgress(c.id, userId) : 0;
            const pct = Math.min(100, Math.round((progress / c.goal) * 100));
            const cd = this.getCountdown(c.endDate);
            const lb = this.getChallengeLeaderboard(c.id);
            const participants = lb.length;
            const rank = lb.findIndex(l => l.userId === userId) + 1;
            return `
                        <div class="challenge-card" style="--accent-c:${colors[i % colors.length]}">
                            <div class="challenge-card-header">
                                <div class="challenge-icon" style="background:${colors[i % colors.length]}20;color:${colors[i % colors.length]}">${c.icon}</div>
                                <div class="challenge-meta">
                                    <h3>${c.name}</h3>
                                    <p>${c.description}</p>
                                </div>
                            </div>

                            <div class="challenge-countdown">
                                ${cd.expired ? `<span class="challenge-ended">${I18n.t('challenges.ended')}</span>` : `
                                    <div class="countdown-unit"><span class="cd-num">${cd.days}</span><span class="cd-label">${I18n.t('challenges.days')}</span></div>
                                    <div class="countdown-sep">:</div>
                                    <div class="countdown-unit"><span class="cd-num">${cd.hours}</span><span class="cd-label">${I18n.t('challenges.hrs')}</span></div>
                                    <div class="countdown-sep">:</div>
                                    <div class="countdown-unit"><span class="cd-num">${cd.minutes}</span><span class="cd-label">${I18n.t('challenges.min')}</span></div>
                                `}
                            </div>

                            <div class="challenge-stats">
                                <div class="challenge-stat"><span class="cs-val">${participants}</span><span class="cs-label">${I18n.t('challenges.participants')}</span></div>
                                <div class="challenge-stat"><span class="cs-val">${c.xpReward}</span><span class="cs-label">${I18n.t('challenges.xpReward')}</span></div>
                                <div class="challenge-stat"><span class="cs-val">${c.badge.emoji}</span><span class="cs-label">${I18n.t('challenges.badge')}</span></div>
                            </div>

                            ${joined ? `
                                <div class="challenge-progress">
                                    <div class="challenge-progress-header">
                                        <span>${I18n.t('challenges.yourProgress')}</span>
                                        <span style="color:${colors[i % colors.length]}">${pct}%</span>
                                    </div>
                                    <div class="challenge-progress-bar">
                                        <div class="challenge-progress-fill" style="width:${pct}%;background:${colors[i % colors.length]}"></div>
                                    </div>
                                    <div class="challenge-progress-footer">
                                        <span>${progress.toLocaleString()} / ${c.goal.toLocaleString()} ${I18n.t('trainer.' + c.unit) || c.unit}</span>
                                        ${rank > 0 ? `<span>${I18n.t('challenges.rank')} #${rank}</span>` : ''}
                                    </div>
                                </div>
                                <button class="btn btn-ghost btn-sm challenge-leave-btn" onclick="ChallengeSystem.leaveChallenge('${c.id}')">${I18n.t('challenges.leave')}</button>
                            ` : `
                                <button class="btn btn-primary challenge-join-btn" style="background:linear-gradient(135deg,${colors[i % colors.length]},${colors[i % colors.length]}dd)" onclick="ChallengeSystem.joinChallenge('${c.id}')">
                                    ${I18n.t('challenges.join')}
                                </button>
                            `}

                            <!-- Mini Leaderboard -->
                            ${lb.length > 0 ? `
                                <div class="challenge-lb">
                                    <h4>${I18n.t('challenges.top5')}</h4>
                                    ${lb.slice(0, 5).map((l, ri) => `
                                        <div class="challenge-lb-row ${l.userId === userId ? 'challenge-lb-me' : ''}">
                                            <span class="challenge-lb-rank">${ri + 1}</span>
                                            <span class="challenge-lb-name">${l.name}${l.userId === userId ? ` ${I18n.t('challenges.you')}` : ''}</span>
                                            <span class="challenge-lb-pct">${l.pct}%</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
        }).join('')}
            </div>

            <!-- Achievement Badges -->
            <div class="card badges-section" style="margin-top:28px;">
                <div class="card-header"><h3>${I18n.t('challenges.badgesTitle')}</h3></div>
                <div class="badges-grid">
                    ${this.badges.map(b => {
            const unlocked = userBadges.includes(b.id);
            return `
                            <div class="badge-item ${unlocked ? 'badge-unlocked' : 'badge-locked'}">
                                <div class="badge-icon" style="${unlocked ? `background:${b.color}20;color:${b.color}` : ''}">${b.emoji}</div>
                                <div class="badge-name">${I18n.t('challenges.badge_' + b.id + '_name') || b.name}</div>
                                <div class="badge-desc">${I18n.t('challenges.badge_' + b.id + '_desc') || b.description}</div>
                                ${unlocked ? `<span class="badge-status unlocked">${I18n.t('challenges.unlocked')}</span>` : `<span class="badge-status locked">${I18n.t('challenges.locked')}</span>`}
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    },

    // Seed demo participation
    seedDemoParticipation() {
        const parts = Store.getA('challenge_participation');
        if (parts.length > 0) return;
        const members = Auth.getMembers();
        const challenges = this.getChallenges();
        const seeded = [];
        members.forEach(m => {
            challenges.forEach(c => {
                if (Math.random() > 0.4) {
                    seeded.push({
                        challengeId: c.id,
                        userId: m.id,
                        userName: m.name,
                        joinedAt: new Date(Date.now() - Math.random() * 10 * 86400000).toISOString(),
                        progress: Math.round(Math.random() * c.goal * 0.8),
                    });
                }
            });
        });
        if (seeded.length > 0) Store.set('challenge_participation', seeded);
    },

    // ==================== ADMIN RENDER ====================
    renderAdminChallenges() {
        const s = document.getElementById('section-a-challenges');
        if (!s) return;
        const challenges = this.getChallenges();
        const now = Date.now();
        const colors = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#06b6d4'];

        s.innerHTML = `
            <div class="section-header">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
                    <div><h1>${I18n.t('challenges.manageTitle')}</h1><p class="section-subtitle">${I18n.t('challenges.manageSubtitle')}</p></div>
                    <button class="btn btn-primary" onclick="openModal('challengeModal')">+ ${I18n.t('challenges.newChallenge')}</button>
                </div>
            </div>

            <div class="challenges-admin-list">
                ${challenges.map((c, i) => {
            const cd = this.getCountdown(c.endDate);
            const parts = Store.getA('challenge_participation').filter(p => p.challengeId === c.id);
            const isActive = !cd.expired;
            return `
                        <div class="challenge-admin-card">
                            <div class="challenge-admin-left">
                                <div class="challenge-icon" style="background:${colors[i % colors.length]}20;color:${colors[i % colors.length]}">${c.icon}</div>
                                <div>
                                    <h3>${c.name}</h3>
                                    <p class="text-muted">${c.description}</p>
                                    <div class="challenge-admin-meta">
                                        <span>🏆 ${c.xpReward} XP</span>
                                        <span>👥 ${parts.length} ${I18n.t('challenges.participants').toLowerCase()}</span>
                                        <span>🎯 ${c.goal.toLocaleString()} ${I18n.t('trainer.' + c.unit) || c.unit}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="challenge-admin-right">
                                <span class="badge ${isActive ? 'badge-active' : 'badge-expired'}">${isActive ? I18n.t('challenges.active') : I18n.t('challenges.ended')}</span>
                                ${isActive ? `<span class="text-muted" style="font-size:0.78rem">${cd.days}${I18n.t('challenges.days')[0]} ${cd.hours}${I18n.t('challenges.hrs')[0]} ${I18n.t('challenges.left')}</span>` : ''}
                                <button class="btn btn-ghost btn-sm" onclick="ChallengeSystem.deleteChallenge('${c.id}')">${I18n.t('admin.delete')}</button>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    createChallenge(e) {
        e.preventDefault();
        const name = document.getElementById('chName').value;
        const type = document.getElementById('chType').value;
        const goal = parseInt(document.getElementById('chGoal').value) || 1000;
        const xp = parseInt(document.getElementById('chXP').value) || 200;
        const days = parseInt(document.getElementById('chDays').value) || 30;
        const icons = { steps: '🚶', workouts: '💪', calories: '🔥', streak: '🔥', xp: '⭐' };
        const units = { steps: 'steps', workouts: 'workouts', calories: 'kcal', streak: 'days', xp: 'XP' };

        const challenge = {
            id: Store.genId('CH'),
            name,
            type,
            icon: icons[type] || '🏆',
            description: `Complete ${goal.toLocaleString()} ${units[type] || type} in ${days} days!`,
            goal,
            unit: units[type] || type,
            xpReward: xp,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + days * 86400000).toISOString(),
            badge: { name: name.split(' ')[0] + ' Winner', emoji: icons[type] || '🏆', color: '#f97316' },
            season: 'custom'
        };

        const challenges = this.getChallenges();
        challenges.push(challenge);
        Store.set('challenges', challenges);
        closeModal('challengeModal');
        showToast(I18n.t('challenges.createdSuccess'), 'success');
        this.renderAdminChallenges();
    },

    deleteChallenge(id) {
        let challenges = this.getChallenges().filter(c => c.id !== id);
        Store.set('challenges', challenges);
        let parts = Store.getA('challenge_participation').filter(p => p.challengeId !== id);
        Store.set('challenge_participation', parts);
        showToast(I18n.t('challenges.deletedSuccess'), 'info');
        this.renderAdminChallenges();
    }
};
