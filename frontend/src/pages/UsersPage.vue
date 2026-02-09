<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Organisationsnutzer</Headline>
        <Text tone="muted">Permissions pro Feature steuern.</Text>
      </div>
      <Button>Neuen Nutzer anlegen</Button>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-800">
      <table class="min-w-full divide-y divide-slate-800">
        <thead class="bg-slate-900">
          <tr>
            <th class="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-400">Name</th>
            <th class="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-400">Rolle</th>
            <th
              v-for="feature in featureDefinitions"
              :key="feature.key"
              class="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-400"
            >
              {{ feature.label }}
            </th>
            <th class="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-400">Aktion</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800 bg-slate-950">
          <tr v-if="isLoading">
            <td :colspan="featureDefinitions.length + 3" class="px-4 py-6 text-sm text-slate-400">
              Lade Berechtigungen…
            </td>
          </tr>
          <tr v-else-if="errorMessage">
            <td :colspan="featureDefinitions.length + 3" class="px-4 py-6 text-sm text-rose-300">
              {{ errorMessage }}
            </td>
          </tr>
          <tr v-else-if="members.length === 0">
            <td :colspan="featureDefinitions.length + 3" class="px-4 py-6 text-sm text-slate-400">
              Keine Nutzer gefunden.
            </td>
          </tr>
          <tr
            v-for="member in members"
            :key="member.id"
            class="hover:bg-slate-900/60"
          >
            <td class="px-4 py-3 text-sm text-slate-200">
              {{ member.user.displayName }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-200">
              {{ roleLabels[member.role] ?? member.role }}
            </td>
            <td
              v-for="feature in featureDefinitions"
              :key="feature.key"
              class="px-4 py-3 text-sm text-slate-200"
            >
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                  :checked="isFeatureEnabled(member, feature.key)"
                  :disabled="isUpdating[member.id]"
                  @change="onTogglePermission(member, feature.key, $event)"
                />
                <span class="text-xs text-slate-400">Aktiv</span>
              </label>
            </td>
            <td class="px-4 py-3 text-sm text-slate-400">
              —
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <Headline size="md">Permissions Editor</Headline>
      <Text tone="muted">Lesen / Bearbeiten pro Seite festlegen.</Text>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import { api } from '../lib/api';

type PermissionLevel = 'NONE' | 'READ' | 'WRITE';

type MemberPermission = {
  featureKey: string;
  level: PermissionLevel;
};

type Member = {
  id: string;
  role: string;
  user: {
    displayName: string;
  };
  permissions: MemberPermission[];
};

type OrgResponse = {
  organization: {
    id: string;
  };
};

type MembersResponse = {
  members: Member[];
};

const featureDefinitions = [
  { key: 'invoices', label: 'Rechnungen' },
  { key: 'customers', label: 'Kunden' },
  { key: 'items', label: 'Produkte' }
];

const roleLabels: Record<string, string> = {
  OWNER: 'Organisationsleiter',
  ADMIN: 'Admin',
  ACCOUNTING: 'Buchhaltung',
  MEMBER: 'Mitarbeiter'
};

const members = ref<Member[]>([]);
const orgId = ref<string | null>(null);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const isUpdating = ref<Record<string, boolean>>({});

const loadMembers = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const { data: orgPayload } = await api.get<OrgResponse>('/api/orgs/me');
    orgId.value = orgPayload.organization.id;
    const { data: membersPayload } = await api.get<MembersResponse>(`/api/orgs/${orgId.value}/members`);
    members.value = membersPayload.members;
  } catch (error) {
    errorMessage.value = 'Permissions konnten nicht geladen werden.';
  } finally {
    isLoading.value = false;
  }
};

const isFeatureEnabled = (member: Member, featureKey: string) => {
  const permission = member.permissions.find((perm) => perm.featureKey === featureKey);
  return permission?.level === 'READ' || permission?.level === 'WRITE';
};

const buildPermissionsPayload = (member: Member, featureKey: string, enabled: boolean): MemberPermission[] => {
  const permissionMap = new Map<string, PermissionLevel>();
  member.permissions.forEach((permission) => {
    permissionMap.set(permission.featureKey, permission.level);
  });

  permissionMap.set(featureKey, enabled ? 'READ' : 'NONE');

  featureDefinitions.forEach((feature) => {
    if (!permissionMap.has(feature.key)) {
      permissionMap.set(feature.key, 'NONE');
    }
  });

  return Array.from(permissionMap.entries()).map(([key, level]) => ({
    featureKey: key,
    level
  }));
};

const onTogglePermission = async (member: Member, featureKey: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const enabled = target.checked;
  if (!orgId.value) {
    return;
  }
  const updatedPermissions = buildPermissionsPayload(member, featureKey, enabled);
  const previousPermissions = member.permissions;
  member.permissions = updatedPermissions;
  isUpdating.value = { ...isUpdating.value, [member.id]: true };
  try {
    await api.patch(`/api/orgs/${orgId.value}/members/${member.id}`, {
      role: member.role,
      permissions: updatedPermissions
    });
  } catch (error) {
    member.permissions = previousPermissions;
    errorMessage.value = 'Änderungen konnten nicht gespeichert werden.';
  } finally {
    isUpdating.value = { ...isUpdating.value, [member.id]: false };
  }
};

onMounted(() => {
  loadMembers();
});
</script>
