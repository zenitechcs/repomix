<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import { computed } from 'vue';
import { isValidRemoteValue } from './utils/validation.js';

const props = defineProps<{
  url: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  'update:url': [value: string];
  submit: [];
  keydown: [event: KeyboardEvent];
}>();

const isValidUrl = computed(() => {
  if (!props.url) return false;
  return isValidRemoteValue(props.url.trim());
});

function handleUrlInput(event: Event) {
  const input = event.target as HTMLInputElement;
  emit('update:url', input.value);
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event);
}
</script>

<template>
  <div class="input-group">
    <div class="url-input-container">
      <input
        :value="url"
        @input="handleUrlInput"
        @keydown="handleKeydown"
        type="text"
        placeholder="GitHub repository URL or user/repo (e.g., yamadashy/repomix)"
        class="repository-input"
        :class="{ 'invalid': url && !isValidUrl }"
        aria-label="GitHub repository URL"
      />
      <button
        type="submit"
        class="pack-button"
        :disabled="!isValidUrl || loading"
        aria-label="Pack repository"
      >
        {{ loading ? 'Processing...' : 'Pack' }}
        <svg v-if="!loading"
          class="pack-button-icon"
          width="20"
          height="20"
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

    <div v-if="url && !isValidUrl" class="url-warning">
      <AlertTriangle class="warning-icon" size="16" />
      <span>Please enter a valid GitHub repository URL (e.g., yamadashy/repomix)</span>
    </div>
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 24px;
}

.url-input-container {
  display: flex;
  gap: 12px;
}

.repository-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.2s;
}

.repository-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.repository-input.invalid {
  border-color: var(--vp-c-danger-1);
}

.url-warning {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-warning-1);
  font-size: 14px;
}

.warning-icon {
  flex-shrink: 0;
  color: var(--vp-c-warning-1);
}

.pack-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pack-button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.pack-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pack-button-icon {
  font-size: 20px;
  line-height: 1;
}

@media (max-width: 640px) {
  .url-input-container {
    flex-direction: column;
  }
}
</style>
