import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
import mitt from 'mitt'

import 'vue3-perfect-scrollbar/style.css'
import '@marcoschulte/vue3-progress/dist/index.css'
import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/regular.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'
import '@fortawesome/fontawesome-free/scss/brands.scss'
import '@fortawesome/fontawesome-free/scss/v4-shims.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import './scss/styles.scss'

import App from './App.vue'
import router from './router'

import Card from '@/components/bootstrap/Card.vue'
import CardBody from '@/components/bootstrap/CardBody.vue'
import CardHeader from '@/components/bootstrap/CardHeader.vue'
import CardFooter from '@/components/bootstrap/CardFooter.vue'
import CardGroup from '@/components/bootstrap/CardGroup.vue'
import CardImgOverlay from '@/components/bootstrap/CardImgOverlay.vue'
import CardExpandToggler from '@/components/bootstrap/CardExpandToggler.vue'

// ✅ Apollo 관련 추가
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo'  // ← 너가 만든 apollo.ts 경로

const emitter = mitt()

// ✅ 앱 생성 및 ApolloClient 주입
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

app.component('Card', Card)
app.component('CardBody', CardBody)
app.component('CardHeader', CardHeader)
app.component('CardFooter', CardFooter)
app.component('CardGroup', CardGroup)
app.component('CardImgOverlay', CardImgOverlay)
app.component('CardExpandToggler', CardExpandToggler)

app.use(createPinia())
app.use(router)
app.use(Vue3ProgressPlugin)
app.use(PerfectScrollbarPlugin)

app.config.globalProperties.emitter = emitter
app.mount('#app')
