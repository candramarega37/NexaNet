/** @param {{role?: string}|null|undefined} user @param {string} role */
export function hasRole(user, role) { return Boolean(user && user.role === role); }

/** @param {{role?: string}|null|undefined} user */
export function isAdmin(user) { return hasRole(user, "ADMIN"); }

/** @param {{role?: string}|null|undefined} user */
export function isTeacher(user) { return hasRole(user, "TEACHER"); }

/** @param {{role?: string}|null|undefined} user */
export function isStudent(user) { return hasRole(user, "STUDENT"); }

/** @param {{role?: string}|null|undefined} user */
export function canManageContent(user) { return isAdmin(user) || isTeacher(user); }

/** @param {{role?: string}|null|undefined} user */
export function canDeleteContent(user) { return isAdmin(user) || isTeacher(user); }

/** @param {{role?: string}|null|undefined} user */
export function canViewContent(user) { return Boolean(user); }
