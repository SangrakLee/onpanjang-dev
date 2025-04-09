import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'

export function useDropdowns() {
  const selectedProvider = ref('')       // 선택된 공급자 이름 (string)
  const selectedItem = ref('')           // 선택된 품목 이름 (string)

  const providers = ref([])              // 전체 공급자 목록 [{ id, provider_name, items }]
  const providerItems = ref([])          // 선택된 공급자의 items 목록 (ex. ["참외", "토마토"])
  const filteredPrices = ref([])         // 가격 필터 결과

  // 🔹 공급자 목록 불러오기
  const fetchProviders = async () => {
    const { data, error } = await supabase
      .from('providers')
      .select('id, provider_name, items')

    if (error) {
      console.error('공급자 목록 조회 오류:', error)
    } else {
      providers.value = data
    }
  }

  // 🔹 가격 정보 불러오기
  const fetchPrices = async () => {
    if (!selectedProvider.value || !selectedItem.value) return

    const { data, error } = await supabase
      .from('v_provider_product_prices')
      .select('provider_name, item_name, grade, size, season_date, price')
      .eq('provider_name', selectedProvider.value)
      .eq('item_name', selectedItem.value)

    if (error) {
      console.error('단가 조회 오류:', error)
    } else {
      filteredPrices.value = data
    }
  }

  // 🔸 공급자 선택되면 → 그 공급자의 품목목록 가져오기
  watch(selectedProvider, (newProviderName) => {
    const provider = providers.value.find(p => p.provider_name === newProviderName)
    providerItems.value = provider ? provider.items : []

    // 공급자 바뀌면 단가도 새로 뽑아야 함!
    fetchPrices()
  })

  // 🔸 공급자 또는 품목 바뀌면 → 가격정보 다시 불러오기
  watch([selectedProvider, selectedItem], () => {
    fetchPrices()
  })

  onMounted(() => {
    fetchProviders()
  })

  return {
    selectedProvider,
    selectedItem,
    providers,
    providerItems,
    filteredPrices
  }
}
