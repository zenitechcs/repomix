<template>
  <div class="file-selection-container">
    <div class="file-selection-header">
      <h3 class="file-selection-title">
        <FileText :size="16" class="title-icon" />
        File Selection
      </h3>
      <div class="file-selection-actions">
        <button
          type="button"
          class="action-btn select-all"
          @click="selectAll"
          :disabled="!hasFiles"
        >
          Select All
        </button>
        <button
          type="button"
          class="action-btn deselect-all"
          @click="deselectAll"
          :disabled="!hasFiles"
        >
          Deselect All
        </button>
        <button
          type="button"
          class="action-btn repack"
          @click="handleRepack"
          :disabled="!hasSelectedFiles || loading"
        >
          {{ loading ? 'Re-packing...' : 'Re-pack Selected' }}
          <svg
            v-if="!loading"
            class="pack-button-icon"
            width="14"
            height="14"
            viewBox="96.259 93.171 300 300"
          >
            <g transform="matrix(1.160932, 0, 0, 1.160932, 97.635941, 94.725143)">
              <path
                fill="currentColor"
                d="M 128.03 -1.486 L 21.879 65.349 L 21.848 190.25 L 127.979 256.927 L 234.2 190.27 L 234.197 65.463 L 128.03 -1.486 Z M 208.832 70.323 L 127.984 121.129 L 47.173 70.323 L 128.144 19.57 L 208.832 70.323 Z M 39.669 86.367 L 119.188 136.415 L 119.255 230.529 L 39.637 180.386 L 39.669 86.367 Z M 136.896 230.506 L 136.887 136.575 L 216.469 86.192 L 216.417 180.46 L 136.896 230.506 Z M 136.622 230.849"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>

    <div class="file-selection-stats">
      <span class="stat-item">
        {{ selectedFiles.length }} of {{ allFiles.length }} files selected
      </span>
      <span class="stat-separator">|</span>
      <span class="stat-item">
        {{ selectedTokens.toLocaleString() }} tokens
        ({{ ((selectedTokens / totalTokens) * 100).toFixed(1) }}%)
      </span>
    </div>

    <div class="file-list-container">
      <div class="file-list-scroll">
        <table class="file-table">
          <thead>
            <tr>
              <th class="checkbox-column">
                <input
                  type="checkbox"
                  :checked="selectedFiles.length === allFiles.length && allFiles.length > 0"
                  :indeterminate="selectedFiles.length > 0 && selectedFiles.length < allFiles.length"
                  @change="($event.target as HTMLInputElement).checked ? selectAll() : deselectAll()"
                  class="header-checkbox"
                />
              </th>
              <th class="file-path-column">File Path</th>
              <th class="tokens-column">Tokens</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in sortedFiles"
              :key="file.path"
              class="file-row"
              :class="{ 'file-row-selected': file.selected }"
              @click="toggleFileSelection(file, $event)"
            >
              <td class="checkbox-cell">
                <input
                  type="checkbox"
                  v-model="file.selected"
                  class="file-checkbox"
                  @change="onFileSelectionChange"
                />
              </td>
              <td class="file-path-cell">
                <span class="file-path">{{ file.path }}</span>
              </td>
              <td class="tokens-cell">
                <span class="file-tokens">{{ file.tokenCount.toLocaleString() }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <div v-if="selectedFiles.length > 500" class="warning-message">
      <div class="warning-icon">⚠️</div>
      <div class="warning-text">
        Selecting more than 500 files may cause processing issues or timeouts. Consider reducing your selection for better performance.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Package } from 'lucide-vue-next';
import { computed } from 'vue';
import type { FileInfo } from '../api/client';

interface Props {
  allFiles: FileInfo[];
  loading?: boolean;
}

interface Emits {
  (e: 'repack', selectedFiles: FileInfo[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const hasFiles = computed(() => props.allFiles.length > 0);

const selectedFiles = computed(() =>
  props.allFiles.filter(file => file.selected)
);

const hasSelectedFiles = computed(() => selectedFiles.value.length > 0);

const totalTokens = computed(() =>
  props.allFiles.reduce((sum, file) => sum + file.tokenCount, 0)
);

const selectedTokens = computed(() =>
  selectedFiles.value.reduce((sum, file) => sum + file.tokenCount, 0)
);

const sortedFiles = computed(() =>
  [...props.allFiles].sort((a, b) => b.tokenCount - a.tokenCount)
);

const selectAll = () => {
  props.allFiles.forEach(file => {
    file.selected = true;
  });
  onFileSelectionChange();
};

const deselectAll = () => {
  props.allFiles.forEach(file => {
    file.selected = false;
  });
  onFileSelectionChange();
};

const onFileSelectionChange = () => {
  // This will trigger reactivity updates
};

const handleRepack = () => {
  if (hasSelectedFiles.value) {
    emit('repack', selectedFiles.value);
  }
};

const toggleFileSelection = (file: FileInfo, event?: Event) => {
  // Prevent double-toggling when clicking directly on checkbox
  if (event?.target && (event.target as HTMLInputElement).type === 'checkbox') {
    return;
  }

  file.selected = !file.selected;
  onFileSelectionChange();
};
</script>

<style scoped>
.file-selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  border-radius: 8px 8px 0 0;
}

.file-selection-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  color: var(--vp-c-text-2);
}

.file-selection-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.action-btn.repack {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.action-btn.repack:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-selection-stats {
  padding: 12px 16px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-border);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.stat-item {
  color: var(--vp-c-text-1);
}

.stat-separator {
  margin: 0 8px;
  color: var(--vp-c-text-3);
}

.file-list-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
}

.file-list-scroll {
  padding: 0;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th {
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
  padding: 8px 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  position: sticky;
  top: 0;
}

.checkbox-column {
  width: 40px;
  text-align: center;
}

.file-path-column {
  width: 70%;
}

.tokens-column {
  width: 30%;
  text-align: left;
}

.file-row {
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.file-row:hover {
  background: var(--vp-c-bg-soft);
}

.file-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--vp-c-border-soft);
}

.checkbox-cell {
  text-align: center;
}

.file-path-cell {
  max-width: 0;
  width: 100%;
}

.file-path {
  font-size: 13px;
  color: var(--vp-c-text-1);
  word-break: break-all;
  font-family: var(--vp-font-family-mono);
}

.tokens-cell {
  text-align: left;
}

.file-tokens {
  font-size: 12px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.header-checkbox {
  cursor: pointer;
}

.file-checkbox {
  cursor: pointer;
}

.warning-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  background: var(--vp-c-warning-soft);
  border: 1px solid var(--vp-c-warning);
  border-radius: 4px;
  margin-bottom: 8px;
}

.warning-icon {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.warning-text {
  font-size: 13px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .file-selection-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .file-selection-actions {
    justify-content: space-between;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
