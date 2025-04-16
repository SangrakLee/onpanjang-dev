import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'

export const useOrderSummary = () => {
  const itemSummary = ref([])
  const loading = ref(false)
  const orders = ref([]) // ✅ 전체 주문 저장용


  const fetchTodaySummaryByProvider = async (providerIdUUID) => {
    loading.value = true

    // 1. 연결된 셀러 ID 가져오기
    const { data: linkedSellers, error: linkError } = await supabase
      .from('provider_seller_links')
      .select('seller_id')
      .eq('provider_id', providerIdUUID)
      .eq('is_approved', true)

    if (linkError || !linkedSellers?.length) {
      console.error('❌ 연결된 셀러 조회 오류:', linkError)
      loading.value = false
      return
    }

    const sellerIds = linkedSellers.map(link => link.seller_id)

    // 1. 오늘 + 공급자 주문 불러오기
    const today = dayjs().format('YYYY-MM-DD')
    const { data, error } = await supabase
      .from('seller_orders')
      .select(`
        seller_id,
        seller_name:sellers!seller_orders_seller_id_fkey(seller_name),
        parsed_name,
        box_count,
        raw_data,
        amount
      `)
      .in('seller_id', sellerIds)
      .eq('order_date', today) // ✅ 문자열로 정확히 오늘 날짜 필터

    if (error) {
      console.error('❌ 주문 불러오기 오류:', error)
      loading.value = false
      return
    }

    orders.value = data// ✅ Supabase에서 받아온 원본 주문 전체 저장

    // ✅ 2. 품목명 통합 요약 itemSummary (원본 전체 기준으로 계산)

    const itemGroupedByType = {}

    orders.value.forEach(order => {
      const rawData = typeof order.raw_data === 'string'
        ? JSON.parse(order.raw_data)
        : order.raw_data || {}

      const itemType = rawData?.item_type || '기타'
      const parsedName = order.parsed_name || rawData?.상품명정리 || '미정'
      const boxCount = Number(order.box_count || 0)

      const match = parsedName?.match(/(.+)\s(\d+)(kg|KG)/)
      if (!match) return

      const nameOnly = match[1].trim()
      const weightValue = Number(match[2])
      const total = parseFloat((weightValue * boxCount * 0.1).toFixed(1)) // 0.1 = 100g 단위 → kg

      if (!itemGroupedByType[itemType]) {
        itemGroupedByType[itemType] = {}
      }

      if (!itemGroupedByType[itemType][nameOnly]) {
        itemGroupedByType[itemType][nameOnly] = {
          item_name: nameOnly,
          total_kg: 0
        }
      }

      itemGroupedByType[itemType][nameOnly].total_kg += total
    })

    // 2단계: 정렬된 배열로 변환
    const sortedByType = {}
    for (const type in itemGroupedByType) {
      sortedByType[type] = Object.values(itemGroupedByType[type]).sort((a, b) =>
        a.item_name.localeCompare(b.item_name)
      )
    }

    // 저장
    itemSummary.value = sortedByType
    loading.value = false

  }

  return {
    itemSummary,
    orders,
    loading,
    fetchTodaySummaryByProvider
  }
}
