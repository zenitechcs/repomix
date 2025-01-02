<!-- website/client/.vitepress/theme/components/TryIt.vue -->
<script setup>
import { ref } from 'vue'

const url = ref('')
const format = ref('xml')
const removeComments = ref(false)
const removeEmptyLines = ref(false)
const showLineNumbers = ref(false)

const handleSubmit = () => {
  // Handle form submission
  console.log({
    url: url.value,
    format: format.value,
    options: {
      removeComments: removeComments.value,
      removeEmptyLines: removeEmptyLines.value,
      showLineNumbers: showLineNumbers.value
    }
  })
}
</script>

<template>
  <div class="container">
    <div class="try-it-container">
      <div class="input-group">
        <div class="url-input-container">
          <input
              v-model="url"
              type="text"
              placeholder="GitHub repo URL or name (e.g., facebook/react)"
              class="repository-input"
          />
          <button @click="handleSubmit" class="pack-button">
            Pack
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="options-container">
        <div class="option-group">
          <p class="option-label">Output Format</p>
          <div class="format-buttons">
            <button
                class="format-button"
                :class="{ active: format === 'xml' }"
                @click="format = 'xml'"
            >
              XML
            </button>
            <button
                class="format-button"
                :class="{ active: format === 'markdown' }"
                @click="format = 'markdown'"
            >
              Markdown
            </button>
            <button
                class="format-button"
                :class="{ active: format === 'text' }"
                @click="format = 'text'"
            >
              Text
            </button>
          </div>
        </div>

        <div class="option-group">
          <p class="option-label">Output Options</p>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                  v-model="removeComments"
                  type="checkbox"
                  class="checkbox-input"
              />
              <span>Remove Comments</span>
            </label>
            <label class="checkbox-label">
              <input
                  v-model="removeEmptyLines"
                  type="checkbox"
                  class="checkbox-input"
              />
              <span>Remove Empty Lines</span>
            </label>
            <label class="checkbox-label">
              <input
                  v-model="showLineNumbers"
                  type="checkbox"
                  class="checkbox-input"
              />
              <span>Show Line Numbers</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0 20px;
  margin: 0 auto;
  max-width: 960px;
}

.try-it-container {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 24px;
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
}

.repository-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.pack-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.pack-button:hover {
  background: var(--vp-c-brand-2);
}

.input-group {
  margin-bottom: 24px;
}

.options-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
}

.format-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.format-button {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-button:hover {
  border-color: var(--vp-c-brand-1);
}

.format-button.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .url-input-container {
    flex-direction: column;
  }

  .options-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
