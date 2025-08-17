import type { PackOptions } from '../composables/usePackOptions';

// URL parameter constants
const BOOLEAN_PARAMS = [
  'removeComments',
  'removeEmptyLines',
  'showLineNumbers',
  'fileSummary',
  'directoryStructure',
  'outputParsable',
  'compress',
] as const;

const VALID_FORMATS = ['xml', 'markdown', 'plain'] as const;

const URL_PARAM_KEYS = ['repo', 'format', 'style', 'include', 'ignore', ...BOOLEAN_PARAMS] as const;

// Key mapping for internal names to URL parameter names
const KEY_MAPPING: Record<string, string> = {
  includePatterns: 'include',
  ignorePatterns: 'ignore',
};

// Helper function to get URL parameter key from internal key
function getUrlParamKey(internalKey: string): string {
  return KEY_MAPPING[internalKey] || internalKey;
}

// Helper function to validate URL parameter values
export function validateUrlParameters(params: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate format parameter
  if (params.format && !VALID_FORMATS.includes(params.format)) {
    errors.push(`Invalid format: ${params.format}. Must be one of: ${VALID_FORMATS.join(', ')}`);
  }

  // Validate URL length to prevent browser limit issues
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      urlSearchParams.set(key, String(value));
    }
  }

  const maxUrlLength = 2000; // Conservative limit for browser compatibility
  if (urlSearchParams.toString().length > maxUrlLength) {
    errors.push(
      `URL parameters too long (${urlSearchParams.toString().length} chars). Maximum allowed: ${maxUrlLength}`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper function to check if any options differ from defaults
export function hasNonDefaultValues(
  inputUrl: string,
  packOptions: Record<string, unknown>,
  defaultOptions: Record<string, unknown>,
): boolean {
  // Check if there's input URL
  if (inputUrl && inputUrl.trim() !== '') {
    return true;
  }

  // Check if any pack option differs from default
  for (const [key, value] of Object.entries(packOptions)) {
    const defaultValue = defaultOptions[key];
    if (typeof value === 'string' && typeof defaultValue === 'string') {
      if (value.trim() !== defaultValue.trim()) {
        return true;
      }
    } else if (value !== defaultValue) {
      return true;
    }
  }

  return false;
}

export function parseUrlParameters(): Partial<PackOptions & { repo?: string }> {
  if (typeof window === 'undefined') {
    return {};
  }

  const urlParams = new URLSearchParams(window.location.search);
  const params: Partial<PackOptions & { repo?: string }> = {};

  // Repository URL parameter
  const repo = urlParams.get('repo');
  if (repo) {
    params.repo = repo.trim();
  }

  // Format parameter
  const format = urlParams.get('format');
  if (format && (VALID_FORMATS as readonly string[]).includes(format)) {
    params.format = format as (typeof VALID_FORMATS)[number];
  }

  // Style parameter (alternative to format for backward compatibility)
  const style = urlParams.get('style');
  if (style && (VALID_FORMATS as readonly string[]).includes(style)) {
    params.format = style as (typeof VALID_FORMATS)[number];
  }

  // Include patterns
  const include = urlParams.get('include');
  if (include) {
    params.includePatterns = include;
  }

  // Ignore patterns
  const ignore = urlParams.get('ignore');
  if (ignore) {
    params.ignorePatterns = ignore;
  }

  // Boolean parameters
  for (const param of BOOLEAN_PARAMS) {
    const value = urlParams.get(param);
    if (value !== null) {
      // Accept various truthy values: true, 1, yes, on
      params[param] = ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    }
  }

  return params;
}

export function updateUrlParameters(options: Partial<PackOptions & { repo?: string }>): {
  success: boolean;
  error?: string;
} {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window object not available (SSR environment)' };
  }

  try {
    // Validate parameters before updating URL
    const validation = validateUrlParameters(options);
    if (!validation.isValid) {
      console.warn('URL parameter validation failed:', validation.errors);
      // Continue with update but log warnings
    }

    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Clear existing repomix-related parameters
    for (const key of URL_PARAM_KEYS) {
      params.delete(key);
    }

    // Add new parameters
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null) {
        const urlParamKey = getUrlParamKey(key);
        if (typeof value === 'boolean') {
          params.set(urlParamKey, value.toString());
        } else if (typeof value === 'string' && value.trim() !== '') {
          params.set(urlParamKey, value.trim());
        }
      }
    }

    // Update URL without reloading the page
    window.history.replaceState({}, '', url.toString());
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred while updating URL';
    console.error('Failed to update URL parameters:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
