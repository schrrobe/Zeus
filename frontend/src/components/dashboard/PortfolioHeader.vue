<template>
  <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Gesamtübersicht</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Verfolge all deine Wallets und Börsen auf einen Blick.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
