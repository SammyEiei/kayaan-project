<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const modalContent = ref({
  title: '',
  description: '',
  features: [] as string[],
})

const openModal = (type: string) => {
  switch (type) {
    case 'flashcards':
      modalContent.value = {
        title: 'Smart Flashcards',
        description:
          'Our AI-powered flashcard system revolutionizes the way you learn and memorize information.',
        features: [
          'Adaptive learning algorithm that adjusts to your pace',
          'Smart scheduling based on your memory patterns',
          'Interactive multimedia support (images, audio, video)',
          'Progress tracking and performance analytics',
          'Collaborative study groups and sharing options',
        ],
      }
      break
    case 'ai-learning':
      modalContent.value = {
        title: 'AI-Powered Learning',
        description:
          'Harness the power of artificial intelligence to transform your study materials into interactive learning experiences.',
        features: [
          'Automatic quiz generation from your notes',
          'Smart summarization of complex topics',
          'Personalized learning recommendations',
          'Real-time feedback and explanations',
          'Natural language processing for better understanding',
        ],
      }
      break
    case 'study-together':
      modalContent.value = {
        title: 'Study Together',
        description:
          'Connect with fellow learners and create a collaborative learning environment.',
        features: [
          'Create and join study groups',
          'Real-time collaboration on study materials',
          'Peer-to-peer learning and mentoring',
          'Discussion forums and Q&A sessions',
          'Progress sharing and accountability partners',
        ],
      }
      break
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Hero Section with Animated Background -->
    <main
      class="relative flex-grow p-6 flex flex-col items-center justify-center text-center bg-gray-50 overflow-hidden"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <div class="absolute inset-0 opacity-30">
          <div
            class="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          ></div>
          <div
            class="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          ></div>
          <div
            class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          ></div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative max-w-4xl mx-auto space-y-8">
        <h1 class="text-6xl font-extrabold text-gray-900 leading-tight">
          Transform Your
          <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >Learning Journey</span
          >
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the future of education with our AI-powered platform. Create, collaborate, and
          conquer your academic goals.
        </p>
        <div class="flex justify-center space-x-6">
          <router-link
            to="/register"
            class="group flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Learning Free
            <svg
              class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </router-link>
          <router-link
            to="/about"
            class="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            Discover More
          </router-link>
        </div>
      </div>
    </main>

    <!-- Features Section with Cards -->
    <section class="py-20 px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span
            class="inline-block px-4 py-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full mb-4"
            >Why Choose Kayaan?</span
          >
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of tools is designed to make learning more effective and
            enjoyable.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature Card 1 -->
          <div
            class="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Smart Flashcards</h3>
            <p class="text-gray-600 mb-6">
              Create personalized flashcards with our AI-powered system that adapts to your learning
              style and pace.
            </p>
            <button
              @click="openModal('flashcards')"
              class="text-blue-600 font-semibold inline-flex items-center group-hover:text-blue-700"
            >
              Learn more
              <svg
                class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Feature Card 2 -->
          <div
            class="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">AI-Powered Learning</h3>
            <p class="text-gray-600 mb-6">
              Transform your notes into interactive quizzes and summaries with our advanced AI
              technology.
            </p>
            <button
              @click="openModal('ai-learning')"
              class="text-purple-600 font-semibold inline-flex items-center group-hover:text-purple-700"
            >
              Learn more
              <svg
                class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Feature Card 3 -->
          <div
            class="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Study Together</h3>
            <p class="text-gray-600 mb-6">
              Connect with peers, share resources, and learn collaboratively in our interactive
              study groups.
            </p>
            <button
              @click="openModal('study-together')"
              class="text-green-600 font-semibold inline-flex items-center group-hover:text-green-700"
            >
              Learn more
              <svg
                class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="relative py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden"
    >
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWNGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJINnpNNiA0VjBINFY0SDB2Mmg0djRoMnYtNGg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"
      ></div>

      <div class="relative max-w-4xl mx-auto text-center space-y-8">
        <h2 class="text-4xl font-bold">Ready to Start Your Learning Journey?</h2>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">
          Join thousands of students who have already transformed their study habits and achieved
          their academic goals with Kayaan.
        </p>
        <div class="flex justify-center space-x-6">
          <router-link
            to="/register"
            class="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started for Free
          </router-link>
          <router-link
            to="/about"
            class="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
          >
            Learn More
          </router-link>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full p-8 transform transition-all" @click.stop>
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-2xl font-bold text-gray-900">{{ modalContent.title }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-6">{{ modalContent.description }}</p>
        <div class="space-y-4">
          <h4 class="font-semibold text-gray-900">Key Features:</h4>
          <ul class="space-y-3">
            <li
              v-for="(feature, index) in modalContent.features"
              :key="index"
              class="flex items-start"
            >
              <svg
                class="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">{{ feature }}</span>
            </li>
          </ul>
        </div>
        <div class="mt-8 flex justify-end">
          <button
            @click="closeModal"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
