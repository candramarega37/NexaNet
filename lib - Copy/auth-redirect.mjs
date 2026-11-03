export function safePostLoginPath(candidate, role, origin) {
  const fallback = role === "ADMIN" || role === "TEACHER" ? "/admin" : "/dashboard";
  if (typeof candidate !== "string" || !candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\") || /[\u0000-\u001f]/.test(candidate)) return fallback;
  try {
    const destination = new URL(candidate, origin);
    if (destination.origin !== origin || destination.pathname === "/login" || destination.pathname.startsWith("/login/")) return fallback;
    if ((destination.pathname === "/admin" || destination.pathname.startsWith("/admin/")) && role !== "ADMIN" && role !== "TEACHER") return fallback;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}
