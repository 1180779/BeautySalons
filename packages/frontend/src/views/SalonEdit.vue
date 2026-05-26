<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {fetchSalon, updateSalon} from '../api';
import type {PriceLevel} from '@beauty-salons/shared';

const props = defineProps<{ id: string }>();
const router = useRouter();

const loading = ref(true);
const saving = ref(false);
const error = ref('');

const name = ref('');
const address = ref('');
const district = ref('');
const phoneNumber = ref('');
const website = ref('');
const rating = ref('');
const reviewCount = ref('');
const priceLevel = ref('');
const servicesRaw = ref('');

const PRICE_LEVELS = [
  {value: '', label: '— not set —'},
  {value: 'PRICE_LEVEL_FREE', label: 'Free'},
  {value: 'PRICE_LEVEL_INEXPENSIVE', label: '$ Inexpensive'},
  {value: 'PRICE_LEVEL_MODERATE', label: '$$ Moderate'},
  {value: 'PRICE_LEVEL_EXPENSIVE', label: '$$$ Expensive'},
  {value: 'PRICE_LEVEL_VERY_EXPENSIVE', label: '$$$$ Very expensive'},
];

onMounted(async () => {
  try {
    const salon = await fetchSalon(Number(props.id));
    name.value = salon.name;
    address.value = salon.address ?? '';
    district.value = salon.district ?? '';
    phoneNumber.value = salon.phoneNumber ?? '';
    website.value = salon.website ?? '';
    rating.value = salon.rating != null ? String(salon.rating) : '';
    reviewCount.value = salon.reviewCount != null ? String(salon.reviewCount) : '';
    priceLevel.value = salon.priceLevel ?? '';
    servicesRaw.value = salon.services.join(', ');
  } catch (e) {
    error.value = String(e);
  } finally {
    loading.value = false;
  }
});

async function save() {
  saving.value = true;
  error.value = '';
  try {
    await updateSalon(Number(props.id), {
      name: name.value || undefined,
      address: address.value || null,
      district: district.value || null,
      phoneNumber: phoneNumber.value || null,
      website: website.value || null,
      rating: rating.value !== '' ? Number(rating.value) : null,
      reviewCount: reviewCount.value !== '' ? Number(reviewCount.value) : null,
      priceLevel: (priceLevel.value as PriceLevel) || null,
      services: servicesRaw.value.split(',').map(s => s.trim()).filter(Boolean),
    });
    router.push(`/salons/${props.id}`);
  } catch (e) {
    error.value = String(e);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <router-link :to="`/salons/${id}`" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        </router-link>
        <span class="text-sm text-gray-500">Edit salon</span>
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-4 py-6">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      <template v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{{
            error
          }}</p>

        <form class="space-y-4" @submit.prevent="save">
          <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="name">Name</label>
              <input id="name" v-model="name" class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1" required
                     type="text"/>
            </div>
            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="district">District</label>
              <input id="district" v-model="district" class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1"
                     type="text"/>
            </div>
            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="address">Address</label>
              <input id="address" v-model="address" class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1"
                     type="text"/>
            </div>
            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="phoneNumber">Phone</label>
              <input id="phoneNumber" v-model="phoneNumber" class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1"
                     type="tel"/>
            </div>
            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="website">Website</label>
              <input id="website" v-model="website" class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1"
                     type="url"/>
            </div>

            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="rating">Rating</label>
              <input
                  id="rating"
                  v-model="rating"
                  class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1" max="5" min="0" step="0.1"
                  type="number"
              />
            </div>

            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="reviewCount">Reviews</label>
              <input
                  id="reviewCount"
                  v-model="reviewCount"
                  class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1" min="0"
                  type="number"
              />
            </div>

            <div class="flex items-center gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0" for="priceLevel">Price</label>
              <select
                  id="priceLevel"
                  v-model="priceLevel"
                  class="flex-1 text-sm text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1 bg-white"
              >
                <option v-for="p in PRICE_LEVELS" :key="p.value" :value="p.value">{{ p.label }}</option>
              </select>
            </div>

            <div class="flex items-start gap-4 px-4 py-3">
              <label class="w-28 text-sm font-medium text-gray-500 shrink-0 mt-1" for="services">Services</label>
              <textarea
                  id="services"
                  v-model="servicesRaw"
                  class="flex-1 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 px-3 py-2 resize-none"
                  placeholder="manicure, pedicure, …"
                  rows="2"
              />
            </div>
          </div>

          <div class="flex gap-3">
            <button
                :disabled="saving"
                class="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                type="submit"
            >
              {{ saving ? 'Saving…' : 'Save changes' }}
            </button>
            <router-link
                :to="`/salons/${id}`"
                class="px-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>
