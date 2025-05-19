<script setup lang="ts">
// Home page logic here
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <main class="flex-grow p-6 flex flex-col items-center justify-center text-center bg-gray-50">
      <div class="max-w-3xl mx-auto space-y-6">
        <h2 class="text-5xl font-extrabold text-gray-900 leading-tight">
          Learn Smarter,
          <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >Not Harder</span
          >
        </h2>
        <p class="text-lg text-gray-600">
          The all-in-one learning platform that combines flashcards, quizzes, study planner, and
          AI-powered tools to transform the way you study.
        </p>
        <div class="flex justify-center space-x-4">
          <router-link
            to="/signup"
            class="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-md shadow hover:shadow-lg transition-shadow duration-200"
          >
            Get Started
            <svg
              class="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </router-link>
          <router-link
            to="/about"
            class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Learn More
          </router-link>
        </div>
        <!-- Dashboard Preview Placeholder -->
        <!-- <div class="mt-12">
          <img
            src="/path/to/dashboard-preview.png"
            alt="Dashboard preview"
            class="rounded-lg shadow-xl border border-gray-200"
          />
        </div> -->
      </div>
    </main>

    <!-- Features Section -->
    <section class="py-16 px-6 bg-white text-center">
      <div class="max-w-5xl mx-auto space-y-12">
        <div class="space-y-4">
          <span
            class="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full"
            >Features</span
          >
          <h2 class="text-3xl font-bold text-gray-900">Everything You Need to Excel</h2>
          <p class="text-lg text-gray-600">
            Kayaan combines essential study tools into one seamless platform designed to help you
            achieve your academic goals.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div class="flex items-start space-x-4">
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-blue-100 text-blue-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Smart Flashcards</h3>
              <p class="mt-1 text-gray-600">
                Create and study flashcards with spaced repetition algorithms that optimize your
                learning.
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-purple-100 text-purple-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.087 2.242a1 1 0 011.826 0l1.754 5.399a1 1 0 00.95.691h5.677a1 1 0 01.749 1.691l-4.602 3.344a1 1 0 00-.363 1.118l1.754 5.399a1 1 0 01-1.485 1.08l-4.602-3.344a1 1 0 00-1.118 0l-4.602 3.344a1 1 0 01-1.485-1.08l1.754-5.399a1 1 0 00-.363-1.118L2.5 9.923a1 1 0 01.749-1.691h5.677a1 1 0 00.95-.691l1.754-5.399z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">AI-Generated Content</h3>
              <p class="mt-1 text-gray-600">
                Turn your notes or textbooks into quizzes, flashcards, and summaries with our AI
                tools.
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div
              class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-green-100 text-green-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Collaborative Study</h3>
              <p class="mt-1 text-gray-600">
                Form study groups, share resources, and learn together with classmates and friends.
              </p>
            </div>
          </div>
        </div>
        <button
          class="mt-8 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-md shadow hover:shadow-lg transition-shadow duration-200"
        >
          Explore All Features
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </button>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
      <div class="max-w-3xl mx-auto space-y-6">
        <h2 class="text-3xl font-bold">Ready to Transform Your Learning?</h2>
        <p class="text-lg opacity-90">
          Join thousands of students who have already improved their study habits and academic
          performance with Kayaan.
        </p>
        <div class="flex justify-center space-x-4">
          <router-link
            to="/signup"
            class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:shadow-lg transition-shadow duration-200"
          >
            Get Started for Free
          </router-link>
          <router-link
            to="/about"
            class="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-blue-600 transition-colors duration-200"
          >
            Learn More
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
