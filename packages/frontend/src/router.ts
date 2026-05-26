import {createRouter, createWebHistory} from 'vue-router';
import SalonList from './views/SalonList.vue';
import SalonDetail from './views/SalonDetail.vue';
import SalonEdit from './views/SalonEdit.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: SalonList},
        {path: '/salons/:id', component: SalonDetail, props: true},
        {path: '/salons/:id/edit', component: SalonEdit, props: true},
    ],
});
