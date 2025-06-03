<!-- <template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.username" placeholder="Username" />
    <input v-model="form.password" type="password" placeholder="Password" />
    <button type="submit">{{ mode }}</button>
    <p @click="toggleMode">Switch to {{ mode === 'Login' ? 'Register' : 'Login' }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { login, register } from '@/services/authService';
import { useRouter } from 'vue-router';

const form = ref({ username: '', password: '' });
const mode = ref('Login');
const router = useRouter();

const handleSubmit = async () => {
  try {
    const res = mode.value === 'Login' ? await login(form.value) : await register(form.value);
    localStorage.setItem('token', res.data.token); // Save JWT token
    router.push('/dashboard'); // Redirect after login
  } catch (err) {
    alert('Authentication failed');
  }
};

const toggleMode = () => {
  mode.value = mode.value === 'Login' ? 'Register' : 'Login';
};
</script> -->
