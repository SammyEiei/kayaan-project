<template>
  <!-- Celebration Popups Container -->
  <div class="celebration-popups-container">
    <StreakCelebrationPopup
      v-for="celebration in celebrations"
      :key="celebration.id"
      :streak-count="celebration.streakCount"
      :title="celebration.title"
      :message="celebration.message"
      :show-progress="celebration.showProgress"
      :auto-close="celebration.autoClose"
      :auto-close-delay="celebration.autoCloseDelay"
      @close="removeCelebration(celebration.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStreakCelebrations } from '@/composables/useStreakCelebrations'
import StreakCelebrationPopup from './StreakCelebrationPopup.vue'

const { celebrations, removeCelebration } = useStreakCelebrations()
</script>

<style scoped>
.celebration-popups-container {
  position: relative;
  z-index: 9999;
}
</style>

