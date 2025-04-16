import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

export function useSellerPage(sellerId) {
  // 🔸 상태 선언
  const sellerName = ref("");
  const selectedProvider = ref('')
  const selectedItem = ref('')
  const selectedSeasonDate = ref('')
  const providers = ref([])
  const providerItems = ref([])

  const rawRows = ref([])
  const processedOrders = ref([])
  const excelInput = ref(null)  // 주문서 등록 엑셀파일 input 요소에 대한 ref (기본값은 null)

  let toastInstance = null // composable 내부에 있는 toastInstance
  // 외부에서 excelInput ref를 주입받는 함수
  const setExcelInput = (inputRef) => {
    // inputRef는 seller.vue에서 넘겨주는 ref 객체임
    excelInput.value = inputRef.value
  }


  // 외부에서 toastInstance를 주입할 setter 함수
  const setToastInstance = (instance) => {
    toastInstance = instance
  }
  // 주문서 등록 엑셀파일 input 요소에 대한 ref (기본값은 null) - 끝

  // ✅ 셀러 이름 가져오기
  const fetchSellerName = async () => {
    const { data, error } = await supabase
      .from("sellers")
      .select("seller_name")
      .eq("id", sellerId)
      .single();

    if (error || !data) {
      console.error("ID 정보 조회 오류", error);
      router.replace("/some-weird-path-that-doesn’t-exist");
    } else {
      sellerName.value = data.seller_name;
    }
  };

  // 🔸 공급자 목록 불러오기
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

  // 🔸 공급자 선택 시 → 해당 품목 목록 로드
  watch(selectedProvider, (newProviderName) => {
    const provider = providers.value.find(p => p.provider_name === newProviderName)
    providerItems.value = provider ? ['엑셀 품목 일괄', ...provider.items] : []
  })

  onMounted(fetchProviders)

  // 🔸 품목타입 자동 감지 함수
  const detectItemType = (itemName) => {
    const keywords = ['참외', '완숙토마토', '방울토마토', '망고', '오렌지']
    return keywords.find(k => itemName.includes(k)) || ''
  }

  // 🔸 필드 별 대체 이름 매핑
  const fieldMap = {
    받는분성명: ['받는분성명', '수령인', '받는사람', '수령인명'],
    받는분전화번호: ['받는분전화번호', '연락처', '수령인 휴대폰'],
    받는분주소: ['받는분주소', '주소', '받는분주소(전체, 분할)'],
    품목명: ['품목명', '상품명'],
    박스수량: ['박스수량', '수량'],
    배송메세지: ['배송메세지', '요청사항', '배송메세지1', '배송시 요구사항']
  }

  const getMatchedField = (row, aliases) => {
    for (const key of aliases) {
      if (row[key]) return row[key]
    }
    return ''
  }

  // 엑셀 업로드 후 미리보기
  const fetchTodayPreviewOrders = async () => {
    const today = dayjs().format("YYYY-MM-DD");

    if (!sellerId) {
      console.warn("⛔ 미리보기 조건 미충족: sellerId 없음");
      return;
    }

    const { data, error } = await supabase
      .from("seller_orders")
      .select("*")
      .eq("order_date", today)
      .eq("seller_id", sellerId);

    if (data?.length > 0) {
      rawRows.value = data.map((row) => ({
        ...row.raw_data,
        order_number: row.order_number || "",
        invoice_number: row.invoice_number || "",
        seller_id: row.seller_id,
      }));
      processOrders(rawRows.value);
    }
  };
  onMounted(fetchTodayPreviewOrders);


  // 🔸 주문 데이터 가공 (미리보기용)
  const processOrders = (rows) => {
    rawRows.value = rows
    const hasMissingItemType = ref(false)

    processedOrders.value = rows.map((row) => {
      const itemType = row.item_type || row['품목타입'] || ''
      const isBulk = selectedItem.value === '엑셀 품목 일괄'

      if (isBulk && !itemType) {
        hasMissingItemType.value = true
      }

      return {
        orderNo:
          row.order_number ||
          row.orderNo ||
          getMatchedField(row, ['주문번호', 'order_number']) ||
          '',
        받는분성명: getMatchedField(row, fieldMap.받는분성명),
        받는분전화번호: getMatchedField(row, fieldMap.받는분전화번호),
        받는분주소: getMatchedField(row, fieldMap.받는분주소),
        품목명: getMatchedField(row, fieldMap.품목명),
        박스수량: getMatchedField(row, fieldMap.박스수량),
        배송메세지: getMatchedField(row, fieldMap.배송메세지),
        item_type: isBulk ? itemType : selectedItem.value,
        invoice_number: row.invoice_number || ''
      }
    })

    if (hasMissingItemType.value) {
      alert(
        '⚠️ "품목타입" 컬럼이 누락된 행이 있습니다.\n엑셀 파일에 "품목타입" 헤더와 값을 꼭 입력해주세요.'
      )
    }
  }



  // 🔸 엑셀 업로드 → JSON 파싱 → 가공

  const handleExcelUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      // XLSX 라이브러리 사용해서 워크북 파싱
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

      const actualHeaders = Object.keys(json[0] || {})
      if (selectedItem.value === '엑셀 품목 일괄' && !actualHeaders.includes('품목타입')) {
        alert("❗ '품목타입' 헤더가 누락되었습니다.")
        return
      }
      // 실제 주문 처리 함수 호출
      processOrders(json)
    }
    reader.readAsArrayBuffer(file)
  }

  const handleFileUploadClick = () => {
    // 공급자나 품목이 선택되지 않았다면
    if (!selectedProvider.value || !selectedItem.value) {
      console.log("공급자나 품목 미선택 - 토스트 띄움");
      if (toastInstance) {
        toastInstance.show();
      } else {
        console.warn("Toast instance가 아직 준비되지 않음");
      }
      return; // 여기서 바로 return해서 파일 탐색기 열리는 것을 막음
    }

    // 공급자와 품목이 선택된 경우에만 파일 업로드 창을 열도록 함.
    if (excelInput.value) {
      excelInput.value.click();
    } else {
      console.warn("excelInput이 정의되어 있지 않음");
    }
  }


  // 🔸 DB 저장
  const submitOrders = async (orders) => {
    const todayDate = dayjs().format('YYYY-MM-DD')

    const trimmedOrders = orders.map((o) => ({
      ...o,
      orderNo: o.orderNo ? String(o.orderNo).trim() : ''
    }))

    const payload = trimmedOrders.map((row) => ({
      raw_data: row,
      seller_id: sellerId,
      order_number: row.orderNo?.toString().trim() || null,
      recipient_name: row.받는분성명,
      recipient_phone: row.받는분전화번호,
      recipient_address: row['받는분주소'],
      item_name: row.품목명,
      box_count: row.박스수량,
      delivery_message: row.배송메세지,
      item_type: row.item_type,
      provider_name: selectedProvider.value,
      order_date: todayDate
    }))

    const { data, error } = await supabase.from('seller_orders').insert(payload)
    if (error) console.error('🛑 주문 저장 오류:', error)

    return { data, error }
  }

  const resetExcel = () => {
    rawRows.value = []
    processedOrders.value = []
  }
  return {
    // 상태
    sellerName,
    fetchSellerName,
    selectedProvider,
    selectedItem,
    selectedSeasonDate,
    providers,
    providerItems,
    rawRows,
    processedOrders,

    // 함수
    fetchProviders,
    setExcelInput,
    setToastInstance,
    handleExcelUpload,
    handleFileUploadClick,
    processOrders,
    fetchTodayPreviewOrders,
    submitOrders,
    resetExcel
  }
}
