export function sanitizePattern(patterns: string | undefined): string {
  if (!patterns) return '';

  return (
    patterns
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      // Additional security checks
      .filter((p) => {
        // Prevent absolute paths
        if (p.startsWith('/')) return false;
        // Prevent directory traversal
        if (p.includes('../') || p.includes('..\\')) return false;
        // Prevent environment variable expansion
        if (p.includes('$')) return false;
        // Prevent command execution
        if (p.includes('`') || p.includes('$(')) return false;
        return true;
      })
      .join(',')
  );
}
