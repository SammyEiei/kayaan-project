<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">🔢 Number Input Field Demo</h1>
      <p class="text-gray-600">
        แสดงตัวอย่างการใช้งาน Number Input Field ที่ปรับปรุงแล้วสำหรับ Template Prompt
      </p>

      <!-- Demo Fields -->
      <div class="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <h2 class="text-lg font-semibold text-gray-900">Template Fields Example</h2>

        <!-- NUMBER Field -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">
            Number of Questions/Cards
            <span class="text-red-500">*</span>
            <span class="text-xs text-slate-500 ml-2">
              (Enter whole number 1-10)
            </span>
          </label>

          <div class="relative">
            <input
              v-model="numberValue"
              type="text"
              inputmode="numeric"
              pattern="[1-9]|10"
              maxlength="2"
              placeholder="Number of questions/cards (1-10)"
              @input="numberValue = validateNumberInput(numberValue)"
              @blur="numberValue = numberValue || '5'"
              class="w-full px-3 py-2 pr-20 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-slate-400 text-sm">questions</span>
            </div>
          </div>
          <div class="text-xs text-slate-500">
            How many questions or cards to generate
          </div>
        </div>

        <!-- MC_COUNT Field -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">
            Multiple Choice Questions
            <span class="text-red-500">*</span>
            <span class="text-xs text-slate-500 ml-2">
              (Enter whole number 1-10)
            </span>
          </label>

          <div class="relative">
            <input
              v-model="mcValue"
              type="text"
              inputmode="numeric"
              pattern="[1-9]|10"
              maxlength="2"
              placeholder="Multiple choice questions (1-10)"
              @input="mcValue = validateNumberInput(mcValue)"
              @blur="mcValue = mcValue || '5'"
              class="w-full px-3 py-2 pr-20 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-slate-400 text-sm">questions</span>
            </div>
          </div>
          <div class="text-xs text-slate-500">
            How many multiple choice questions to generate
          </div>
        </div>

        <!-- Regular Text Field for Comparison -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">
            Topic
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="topicValue"
            type="text"
            placeholder="e.g., photosynthesis, World War II, calculus"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Demo Values Display -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="font-medium text-blue-900 mb-2">Current Values:</h3>
          <div class="space-y-1 text-sm text-blue-800">
            <div>NUMBER: "{{ numberValue }}" (Type: {{ typeof numberValue }})</div>
            <div>MC_COUNT: "{{ mcValue }}" (Type: {{ typeof mcValue }})</div>
            <div>TOPIC: "{{ topicValue }}"</div>
          </div>
        </div>

        <!-- Validation Demo -->
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="font-medium text-green-900 mb-2">✅ Features:</h3>
          <ul class="text-sm text-green-800 space-y-1">
            <li>• Accepts only whole numbers (1-10)</li>
            <li>• Auto-removes non-numeric characters</li>
            <li>• Auto-corrects out-of-range values</li>
            <li>• Sets default value (5) if left empty</li>
            <li>• Mobile-friendly numeric keyboard</li>
            <li>• Clear visual indicators</li>
            <li>• Helpful descriptions for each field</li>
          </ul>
        </div>

        <!-- Test Cases -->
        <div class="bg-yellow-50 p-4 rounded-lg">
          <h3 class="font-medium text-yellow-900 mb-2">🧪 Test Cases:</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Valid inputs:</strong>
              <ul class="text-yellow-800">
                <li>• "5" → "5"</li>
                <li>• "10" → "10"</li>
                <li>• "1" → "1"</li>
              </ul>
            </div>
            <div>
              <strong>Invalid inputs (auto-corrected):</strong>
              <ul class="text-yellow-800">
                <li>• "0" → "1"</li>
                <li>• "15" → "10"</li>
                <li>• "abc" → ""</li>
                <li>• "" (on blur) → "5"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Demo values
const numberValue = ref('5')
const mcValue = ref('3')
const topicValue = ref('photosynthesis')

// Validation function (same as in AIGenerationPage.vue)
const validateNumberInput = (value: string): string => {
  if (!value) return ''

  // Remove non-digit characters
  const numericValue = value.replace(/\D/g, '')

  // Convert to number and limit to 1-10
  const num = parseInt(numericValue)
  if (isNaN(num)) return ''
  if (num < 1) return '1'
  if (num > 10) return '10'

  return num.toString()
}
</script>
