const sessions = new Map();

function createSession(phone) {
  const session = { phone, state: 'MAIN_MENU', data: {} };
  sessions.set(phone, session);
  return session;
}

function getSession(phone) {
  return sessions.get(phone);
}

function updateSession(phone, updates) {
  const session = getSession(phone);
  if (!session) return null;
  const updated = { ...session, ...updates };
  sessions.set(phone, updated);
  return updated;
}

function clearSession(phone) {
  sessions.delete(phone);
}

module.exports = {
  createSession,
  getSession,
  updateSession,
  clearSession,
};
