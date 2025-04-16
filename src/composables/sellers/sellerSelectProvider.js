import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'

export function useDropdowns() {
  const selectedProvider = ref('')       // 선택된 공급자 이름 (string)
  const selectedItem = ref('')           // 선택된 품목 이름 (string)

  const providers = ref([])              // 전체 공급자 목록 [{ id, provider_name, items }]
  const providerItems = ref([])          // 선택된 공급자의 items 목록 (ex. ["참외", "토마토"])

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

  // 🔸 공급자 선택되면 → 그 공급자의 품목목록 가져오기
  watch(selectedProvider, (newProviderName) => {
    const provider = providers.value.find(p => p.provider_name === newProviderName)
    providerItems.value = provider ? ['엑셀 품목 일괄', ...provider.items] : []
  })

  onMounted(() => {
    fetchProviders()
  })

  return {
    selectedProvider,
    selectedItem,
    providers,
    providerItems
  }
}
