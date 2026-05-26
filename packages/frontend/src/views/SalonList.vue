<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {fetchSalons} from '../api';
import type {SalonListItem} from '@beauty-salons/shared';

const PAGE_SIZE = 12;

const salons = ref<SalonListItem[]>([]);
const loading = ref(true);
const error = ref('');
const page = ref(1);

const districtInput = ref('');
const serviceInput = ref('');
const appliedDistrict = ref('');
const appliedService = ref('');

const districts = computed(() => {
  const set = new Set(salons.value.map(s => s.district).filter(Boolean) as string[]);
  return [...set].sort();
});

const totalPages = computed(() => Math.max(1, Math.ceil(salons.value.length / PAGE_SIZE)));

const paginated = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return salons.value.slice(start, start + PAGE_SIZE);
});

async function load() {
  loading.value = true;
  error.value = '';
  page.value = 1;
  try {
    salons.value = await fetchSalons({
      district: appliedDistrict.value || undefined,
      service: appliedService.value || undefined,
    });
  } catch (e) {
    error.value = String(e);
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  appliedDistrict.value = districtInput.value;
  appliedService.value = serviceInput.value;
  load();
}

function clearFilters() {
  districtInput.value = '';
  serviceInput.value = '';
  appliedDistrict.value = '';
  appliedService.value = '';
  load();
}

function priceLabel(p: string | null) {
  const map: Record<string, string> = {
    PRICE_LEVEL_FREE: 'Free',
    PRICE_LEVEL_INEXPENSIVE: '$',
    PRICE_LEVEL_MODERATE: '$$',
    PRICE_LEVEL_EXPENSIVE: '$$$',
    PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
  };
  return p ? (map[p] ?? p) : null;
}

onMounted(load);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Warsaw Beauty Salons</h1>
        <span class="text-sm text-gray-500">{{ salons.length }} salons</span>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- Filters -->
      <form class="flex flex-wrap gap-3 mb-6" @submit.prevent="applyFilters">
        <select
            v-model="districtInput"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">All districts</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>
        <input
            v-model="serviceInput"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Service (e.g. manicure)"
        />
        <button
            class="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            type="submit"
        >
          Filter
        </button>
        <button
            v-if="appliedDistrict || appliedService"
            class="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            type="button"
            @click="clearFilters"
        >
          Clear
        </button>
      </form>

      <!-- States -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div class="h-44 bg-gray-200"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <p v-else-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <p v-else-if="!salons.length" class="text-gray-500 text-sm">No salons found.</p>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
            v-for="s in paginated"
            :key="s.id"
            :to="`/salons/${s.id}`"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <!-- Placeholder image -->
          <div class="h-44 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <svg class="w-12 h-12 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.5"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="1.5"/>
            </svg>
          </div>

          <div class="p-4">
            <h2 class="font-semibold text-gray-900 text-sm group-hover:text-pink-600 transition-colors line-clamp-1">
              {{ s.name }}
            </h2>
            <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ s.address ?? s.district ?? '—' }}</p>

            <div class="flex items-center gap-2 mt-3">
                            <span v-if="s.rating != null"
                                  class="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                <svg class="w-3 h-3 fill-amber-400" viewBox="0 0 20 20"><path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                {{ s.rating.toFixed(1) }}
                            </span>
              <span v-if="s.reviewCount" class="text-xs text-gray-400">({{ s.reviewCount }})</span>
              <span v-if="priceLabel(s.priceLevel)"
                    class="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {{ priceLabel(s.priceLevel) }}
                            </span>
            </div>

            <p v-if="s.district" class="mt-2 text-xs text-gray-400 flex items-center gap-1">
              <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
              {{ s.district }}
            </p>
          </div>
        </router-link>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="flex items-center justify-center gap-1 mt-8">
        <button
            :disabled="page === 1"
            class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="page--"
        >←
        </button>

        <template v-for="p in totalPages" :key="p">
          <button
              v-if="Math.abs(p - page) <= 2 || p === 1 || p === totalPages"
              :class="p === page
                            ? 'bg-pink-500 border-pink-500 text-white font-medium'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-100'"
              class="min-w-[36px] px-3 py-1.5 rounded-lg text-sm border transition-colors"
              @click="page = p"
          >{{ p }}
          </button>
          <span
              v-else-if="Math.abs(p - page) === 3"
              class="px-1 text-gray-400 text-sm"
          >…</span>
        </template>

        <button
            :disabled="page === totalPages"
            class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="page++"
        >→
        </button>
      </div>
    </div>
  </div>
</template>
