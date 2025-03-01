// utils.js
import config from '../config';

export const copyToClipboard = (text, setCopiedField, fieldName) => {
  navigator.clipboard.writeText(text).then(
    () => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
    },
    (err) => console.error('Copy failed:', err)
  );
};

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const getStatePillColor = (state) => {
  if (!state) return 'bg-orange-500';
  const lower = state.toLowerCase();
  if (lower === 'running') return 'bg-green-600';
  if (lower === 'not running') return 'bg-red-600';
  return 'bg-orange-500';
};

export const calculateRunningTime = (createdAt) => {
  if (!createdAt) return '';
  const diff = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  const remainder = hours % 24;
  return `${days} days ${remainder} hours`;
};

export const parsePorts = (portsString) => {
  if (!portsString) return [];
  return portsString
    .split(',')
    .map((p) => p.trim())
    .map((p) => {
      const arrowIndex = p.indexOf('->');
      if (arrowIndex !== -1) {
        const hostPart = p.slice(0, arrowIndex).trim();
        const hostPort = hostPart.split(':')[1] || '';
        return hostPort;
      } else {
        return p.split('/')[0];
      }
    });
};

export const encryptData = (data) => {
  return btoa(JSON.stringify(data));
};

export const updateCredentials = async (payload) => {
  const encryptedPayload = encryptData(payload);
  const response = await fetch(`${config.baseUrl}/api/updateCred`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload: encryptedPayload }),
  });
  return response.json();
};

export const updateTags = async (payload) => {
  const response = await fetch(`${config.baseUrl}/api/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
};
