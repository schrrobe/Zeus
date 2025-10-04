<template>
  <section class="flex min-h-[60vh] items-center justify-center">
    <form class="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header class="text-center">
        <h2 class="text-2xl font-semibold">Anmelden</h2>
        <p class="mt-1 text-sm text-slate-500">Melde dich mit deinem Zeus Account an.</p>
      </header>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">E-Mail</label>
        <input type="email" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">Passwort</label>
        <input type="password" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <button type="submit" class="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark">
        Login
      </button>
      <p class="text-center text-xs text-slate-500">Noch kein Konto? Wende dich an einen Administrator.</p>
    </form>
  </section>
</template>

<script setup lang="ts"></script>
