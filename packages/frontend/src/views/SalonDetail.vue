<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {fetchSalon} from '../api';
import type {Salon} from '@beauty-salons/shared';

const props = defineProps<{ id: string }>();

const salon = ref<Salon | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    salon.value = await fetchSalon(Number(props.id));
  } catch (e) {
    error.value = String(e);
  } finally {
    loading.value = false;
  }
});

function priceLabel(p: number | null) {
  const labels = ['', 'Free', '$', '$$', '$$$', '$$$$'];
  return p != null && p > 0 ? (labels[p] ?? null) : null;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
        <router-link class="text-gray-400 hover:text-gray-600 transition-colors" to="/">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        </router-link>
        <span class="text-sm text-gray-500">Back to list</span>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 py-6">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-56 bg-gray-200 rounded-xl"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        <div class="h-4 bg-gray-100 rounded w-1/3"></div>
      </div>

      <p v-else-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <template v-else-if="salon">
        <!-- Photos -->
        <div class="mb-6">
          <div v-if="salon.photos?.length" :class="salon.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
               class="grid gap-2">
            <img
                v-for="(url, i) in salon.photos.slice(0, 4)"
                :key="i"
                :alt="`${salon.name} photo ${i + 1}`"
                :class="i === 0 && salon.photos.length > 1 ? 'col-span-2 h-56' : 'h-36'"
                :src="url"
                class="w-full object-cover rounded-xl"
            />
          </div>
          <div v-else
               class="h-56 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-16 h-16 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.5"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="1.5"/>
            </svg>
          </div>
        </div>

        <!-- Title row -->
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 leading-tight">{{ salon.name }}</h1>
            <p v-if="salon.district" class="text-sm text-gray-400 mt-1 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
              {{ salon.district }}
            </p>
          </div>
          <router-link
              :to="`/salons/${salon.id}/edit`"
              class="shrink-0 text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Edit
          </router-link>
        </div>

        <!-- Stats row -->
        <div class="flex flex-wrap gap-3 mb-6">
                    <span v-if="salon.rating != null"
                          class="flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                        <svg class="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        {{ salon.rating.toFixed(1) }}
                        <span class="font-normal text-amber-500">({{ salon.reviewCount ?? 0 }})</span>
                    </span>
          <span v-if="priceLabel(salon.priceLevel)"
                class="text-sm text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
                        {{ priceLabel(salon.priceLevel) }}
                    </span>
          <span v-if="salon.priceRange?.startPrice != null || salon.priceRange?.endPrice != null"
                class="text-sm text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
            {{ salon.priceRange.currency ?? '' }}
            {{ salon.priceRange.startPrice != null ? salon.priceRange.startPrice : '' }}
            {{ salon.priceRange.startPrice != null && salon.priceRange.endPrice != null ? '–' : '' }}
            {{ salon.priceRange.endPrice != null ? salon.priceRange.endPrice : '' }}
          </span>
        </div>

        <!-- Info card -->
        <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mb-6">
          <div v-if="salon.address" class="flex gap-3 px-4 py-3">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
            <span class="text-sm text-gray-700">{{ salon.address }}</span>
          </div>
          <div v-if="salon.phoneNumber" class="flex gap-3 px-4 py-3">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
            <a :href="`tel:${salon.phoneNumber}`" class="text-sm text-pink-600 hover:underline">{{
                salon.phoneNumber
              }}</a>
          </div>
          <div v-if="salon.website" class="flex gap-3 px-4 py-3">
            <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
            <a :href="salon.website" class="text-sm text-pink-600 hover:underline truncate" rel="noopener"
               target="_blank">{{ salon.website }}</a>
          </div>
        </div>

        <!-- Services -->
        <div v-if="salon.services.length" class="mb-6">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Services</h2>
          <div class="flex flex-wrap gap-2">
                        <span
                            v-for="svc in salon.services"
                            :key="svc"
                            class="text-sm bg-pink-50 text-pink-700 border border-pink-100 px-3 py-1 rounded-full"
                        >{{ svc }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
