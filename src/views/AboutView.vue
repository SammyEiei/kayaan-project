<script setup lang="ts">
// No imports needed for now
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl font-bold mb-6">About Kayaan</h1>
        <p class="text-xl opacity-90">
          We are a learning platform that combines AI technology with traditional learning methods
          to create an effective and engaging learning experience.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p class="text-gray-600 text-lg mb-6">
            At Kayaan, we believe that learning should be an engaging and accessible experience for
            everyone. We use AI technology to personalize learning methods for each individual and
            create a supportive community.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="text-center p-6 bg-blue-50 rounded-xl">
              <div
                class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p class="text-gray-600">
                Developing AI technology that makes learning more effective
              </p>
            </div>
            <div class="text-center p-6 bg-purple-50 rounded-xl">
              <div
                class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p class="text-gray-600">Building a supportive and collaborative community</p>
            </div>
            <div class="text-center p-6 bg-green-50 rounded-xl">
              <div
                class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p class="text-gray-600">Committed to providing quality and reliable service</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 px-6 bg-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-50 rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div
                class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
              >
                KW
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Kayaan Team</h3>
                <p class="text-gray-600">System Developers and Designers</p>
              </div>
            </div>
            <p class="text-gray-600">
              Our team consists of experts in education and technology who are dedicated to creating
              the best learning platform.
            </p>
          </div>
          <div class="bg-gray-50 rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div
                class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
              >
                AI
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">AI Team</h3>
                <p class="text-gray-600">AI Development Team</p>
              </div>
            </div>
            <p class="text-gray-600">
              Our AI team works hard to develop technology that makes learning more efficient and
              personalized for each learner.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 px-6 bg-gray-50">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
        <p class="text-gray-600 mb-8">Have questions or suggestions? We'd love to hear from you.</p>
        <router-link
          to="/contact"
          class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Contact Us
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
