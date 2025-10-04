<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header>
      <h3 class="text-lg font-semibold">Benachrichtigungen</h3>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Erhalte Alerts bei großen Preisbewegungen oder fehlgeschlagenen Synchronisierungen.</p>
    </header>
    <ul class="mt-6 space-y-4 text-sm">
      <li class="flex items-center justify-between">
        <div>
          <p class="font-medium">Preisalarme</p>
          <p class="text-xs text-slate-500">Push & E-Mail</p>
        </div>
        <input type="checkbox" checked class="h-5 w-10 rounded-full border-primary text-primary focus:ring-primary" />
      </li>
      <li class="flex items-center justify-between">
        <div>
          <p class="font-medium">Sync Fehler</p>
          <p class="text-xs text-slate-500">Push</p>
        </div>
        <input type="checkbox" checked class="h-5 w-10 rounded-full border-primary text-primary focus:ring-primary" />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts"></script>
