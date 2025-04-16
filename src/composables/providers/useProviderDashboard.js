import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useOrderSummary } from './useOrderSummary'
import { fetchDeliveryFeesByProvider } from './useProviderOrder'

export const useProviderDashboard = () => {
  const route = useRoute()
  const router = useRouter()

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const providerId = ref(route.params.providerNumber || null)
  const providerName = ref('')
  const providerIdUUID = ref(null)
  const selectedType = ref("");
  const deliveryFees = ref({})
  const linkedSellers = ref([])

  const {
    itemSummary,
    orders,
    loading,
    fetchTodaySummaryByProvider
  } = useOrderSummary()

  const fetchProviderInfo = async (providerNumber) => {
    const { data, error } = await supabase
      .from('providers')
      .select('id, provider_name')
      .eq('number', providerNumber)
      .single()

    if (error) {
      console.error('❌ 공급자 정보 조회 오류:', error)
      throw error
    }

    providerId.value = providerNumber
    providerName.value = data.provider_name
    providerIdUUID.value = data.id

    // 배송비 불러오기
    deliveryFees.value = await fetchDeliveryFeesByProvider(data.id)

    // 연결된 셀러 불러오기
    await fetchLinkedSellers(data.id)

    // 오늘자 주문 요약 불러오기
    await fetchTodaySummaryByProvider(data.id)
  }

  const fetchLinkedSellers = async (uuid) => {
    const { data, error } = await supabase
      .from('provider_seller_links')
      .select(`seller_id, sellers ( id, seller_name )`)
      .eq('provider_id', uuid)
      .eq('is_approved', true)

    if (error) {
      console.error('❌ 셀러 연결 조회 오류:', error)
      throw error
    }

    linkedSellers.value = data
  }

  const availableTypes = computed(() => Object.keys(itemSummary.value))

  const weightSummary = computed(() => {
    const summary = {}

    orders.value.forEach(order => {
      const raw = typeof order.raw_data === 'string'
        ? JSON.parse(order.raw_data)
        : order.raw_data || {}

      const weight = Number(order.weight || raw.weight || 0)
      const box = Number(order.box_count || 1)
      const key = `${weight}kg`

      if (!summary[key]) summary[key] = 0
      summary[key] += box
    })

    return summary
  })

  const sellerOrderSummary = computed(() => {
    const summary = {}

    orders.value.forEach(order => {
      const sid = order.seller_id
      if (!summary[sid]) {
        summary[sid] = { count: 0, total: 0 }
      }
      summary[sid].count += 1
      summary[sid].total += Number(order.amount || 0)
    })

    return summary
  })

  onMounted(() => {
    if (providerId.value) {
      fetchProviderInfo(providerId.value)
    }
  })

  const sellerItemSummary = computed(() => {
    const summary = {}

    orders.value.forEach(order => {
      const sid = order.seller_id
      const raw = typeof order.raw_data === 'string'
        ? JSON.parse(order.raw_data)
        : order.raw_data || {}

      const itemType = raw.item_type || '기타'

      if (!summary[sid]) summary[sid] = {}
      if (!summary[sid][itemType]) summary[sid][itemType] = 0

      summary[sid][itemType] += 1
    })

    return summary
  })

  return {
    route,
    router,
    providerId,
    providerName,
    providerIdUUID,
    deliveryFees,
    linkedSellers,
    itemSummary,
    orders,
    loading,
    fetchProviderInfo,
    availableTypes,
    weightSummary,
    today,
    selectedType,
    sellerOrderSummary,
    sellerItemSummary
  }
} 
