import { computed, reactive } from 'vue';

export interface PackOptions {
  format: 'xml' | 'markdown' | 'plain';
  removeComments: boolean;
  removeEmptyLines: boolean;
  showLineNumbers: boolean;
  fileSummary: boolean;
  directoryStructure: boolean;
  includePatterns: string;
  ignorePatterns: string;
  outputParsable: boolean;
  compress: boolean;
}

export function usePackOptions() {
  const packOptions = reactive<PackOptions>({
    format: 'xml',
    removeComments: false,
    removeEmptyLines: false,
    showLineNumbers: false,
    fileSummary: true,
    directoryStructure: true,
    includePatterns: '',
    ignorePatterns: '',
    outputParsable: false,
    compress: false,
  });

  const getPackRequestOptions = computed(() => ({
    removeComments: packOptions.removeComments,
    removeEmptyLines: packOptions.removeEmptyLines,
    showLineNumbers: packOptions.showLineNumbers,
    fileSummary: packOptions.fileSummary,
    directoryStructure: packOptions.directoryStructure,
    includePatterns: packOptions.includePatterns ? packOptions.includePatterns.trim() : undefined,
    ignorePatterns: packOptions.ignorePatterns ? packOptions.ignorePatterns.trim() : undefined,
    outputParsable: packOptions.outputParsable,
    compress: packOptions.compress,
  }));

  function updateOption<K extends keyof PackOptions>(key: K, value: PackOptions[K]) {
    packOptions[key] = value;
  }

  function resetOptions() {
    packOptions.format = 'xml';
    packOptions.removeComments = false;
    packOptions.removeEmptyLines = false;
    packOptions.showLineNumbers = false;
    packOptions.fileSummary = true;
    packOptions.directoryStructure = true;
    packOptions.includePatterns = '';
    packOptions.ignorePatterns = '';
    packOptions.outputParsable = false;
    packOptions.compress = false;
  }

  return {
    packOptions,
    getPackRequestOptions,
    updateOption,
    resetOptions,
  };
}
