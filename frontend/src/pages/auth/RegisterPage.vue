<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="block text-sm font-medium">Name</label>
      <input v-model="fullName" required class="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
    <div class="space-y-2">
      <label class="block text-sm font-medium">E-Mail</label>
      <input v-model="email" type="email" required class="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
    <div class="space-y-2">
      <label class="block text-sm font-medium">Passwort</label>
      <input v-model="password" type="password" required class="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
    <button type="submit" class="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark transition">Account erstellen</button>
    <p class="text-sm text-slate-200 text-center">
      Bereits registriert?
      <RouterLink to="/auth/signin" class="font-semibold text-white hover:underline">Zum Login</RouterLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const email = ref('');
const password = ref('');
const fullName = ref('');
const auth = useAuthStore();
const router = useRouter();

async function handleSubmit() {
  await auth.register({ email: email.value, password: password.value, fullName: fullName.value });
  router.push('/');
}
</script>
