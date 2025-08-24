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
          <Package :size="14" />
          {{ loading ? 'Re-packing...' : 'Re-pack Selected' }}
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
        <div
          v-for="file in sortedFiles"
          :key="file.path"
          class="file-item"
          :class="{ 'file-item-selected': file.selected }"
        >
          <label class="file-checkbox-label">
            <input
              type="checkbox"
              v-model="file.selected"
              class="file-checkbox"
              @change="onFileSelectionChange"
            />
            <div class="file-info">
              <div class="file-path">{{ file.path }}</div>
              <div class="file-stats">
                {{ file.tokenCount.toLocaleString() }} <span class="unit">tokens</span>
                <span class="separator">|</span>
                {{ file.charCount.toLocaleString() }} <span class="unit">chars</span>
                <span class="separator">|</span>
                {{ ((file.tokenCount / totalTokens) * 100).toFixed(1) }}<span class="unit">%</span>
              </div>
            </div>
          </label>
        </div>
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
  padding: 8px;
}

.file-item {
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.file-item:hover {
  background: var(--vp-c-bg-soft);
}

.file-item-selected {
  background: var(--vp-c-bg-alt);
}

.file-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  width: 100%;
}

.file-checkbox {
  margin-top: 2px;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-path {
  font-size: 13px;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
  word-break: break-all;
  font-family: var(--vp-font-family-mono);
}

.file-stats {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.unit {
  color: var(--vp-c-text-3);
  margin-left: 0.2em;
}

.separator {
  color: var(--vp-c-text-3);
  margin: 0 0.5em;
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
