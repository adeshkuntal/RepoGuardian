import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000',
});

export const loginWithGithub = () => {
    window.location.href = 'http://localhost:5000/auth/github';
};

export const fetchUserRepos = (userId) => API.get(`/repo/github/fetch?userId=${userId}`);
export const monitorRepo = (userId, repo) => API.post('/repo/monitor', { userId, repo });
export const fetchMonitoredRepos = (userId) => API.get(`/repo/monitored?userId=${userId}`);
export const fetchCommitTrends = (repoId, userId, range = 'daily') => API.get(`/analysis/commits/${repoId}?userId=${userId}&range=${range}`);
export const triggerAnalysis = (userId, repoId) => API.post(`/analysis/trigger/${repoId}`, { userId });
export const fetchAnalysisHistory = (repoId) => API.get(`/analysis/history/${repoId}`);
export const deleteReport = (reportId) => API.delete(`/analysis/${reportId}`);

export default API;
