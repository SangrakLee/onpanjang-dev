import { ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { Toast } from 'bootstrap'
import { useDropdowns } from './sellerSelectProvider'

const processedOrders = useDropdowns()

export function useSellerOrder(filteredPrices, selectedItem, selectedProvider) {
  const rawRows = ref([])
  const processedOrders = ref([])

  // 정리 맵
  const categoryMap = {
    // 토마토
    '토마토': '토마토',
    // 참외
    '가정용': '가정용', '랜덤': '못난이', '혼합': '못난이', '못난이': '못난이',
    '랜덤혼합': '못난이', '정품': '정품', '프리미엄': '선물용', '선물용': '선물용', '선물': '선물용'
  }

  const sizeMap = {
    //토마토
    '완숙': '완숙',
    //참외
    '대과': '대과', '중과': '중과', '소과': '소과', '꼬마과': '꼬마과', '로얄': '중과',
    '꼬마': '꼬마과', '한입': '꼬마과', '혼합': '혼합과', '소': '소과', '대': '대과', '랜덤': '혼합과'
  }

  const weightMap = {
    '1kg': '1', '1.5kg': '1.5', '2kg': '2', '3kg': '3', '4kg': '4',
    '5kg': '5', '6kg': '6', '7kg': '7', '8kg': '8', '9kg': '9', '10kg': '10',
    '1k': '1', '1.5k': '1.5', '2k': '2', '3k': '3', '4k': '4',
    '5k': '5', '6k': '6', '7k': '7', '8k': '8', '9k': '9', '10k': '10'
  }

  const fieldMap = {
    받는분성명: ['받는분성명', '수령인', '받는사람'],
    받는분전화번호: ['받는분전화번호', '수령인연락처', '연락처'],
    받는분주소: ['받는분주소', '받는분주소(전체, 분할)', '주소'],
    품목명: ['품목명', '상품명', 'item_name'],
    박스수량: ['박스수량', '수량'],
    배송메세지: ['배송메세지', '요청사항'],
  }

  //셀러 엑셀 필드 매칭 함수
  function getMatchedField(row, aliases) {
    for (const key of aliases) {
      if (row[key]) return row[key]
    }
    return ''
  }

  const parseProductName = (originalName = '') => {
    const cleanedName = originalName.toLowerCase().replace(/\s/g, '')
    let grade = '', size = '', weight = ''

    // 등급 정리
    for (const key in categoryMap) {
      if (cleanedName.includes(key)) {
        grade = categoryMap[key]
        break
      }
    }

    // 사이즈 정리
    for (const key in sizeMap) {
      if (cleanedName.includes(key)) {
        size = sizeMap[key]
        break
      }
    }

    // 중량 정리
    for (const key in weightMap) {
      if (cleanedName.toLowerCase().includes(key.toLowerCase())) {
        weight = weightMap[key]
        break
      }
    }

    // 누락 시 기본값 (선택 사항)
    if (!grade) grade = '기타'
    if (!size) size = '기타사이즈'
    if (!weight) weight = '0'

    return {
      grade,
      size,
      weight,
      productName: `${grade} ${size} ${weight}kg`
    }
  }

  const getUnitPrice = (itemName, grade, size) => {
    const matching = filteredPrices.value
      .filter(p =>
        p.item_name.trim() === itemName.trim() &&
        p.grade.trim() === grade.trim() &&
        p.size.trim() === size.trim()
      )
      .sort((a, b) => new Date(b.season_date) - new Date(a.season_date)) // 최신순 정렬

    const match = matching[0] // 가장 최근 단가 하나만 사용

    return match ? match.price : null
  }




  const processOrders = (rows) => {
    rawRows.value = rows

    processedOrders.value = rows.map((row, index) => {
      const itemName = getMatchedField(row, fieldMap.품목명)
      const name = getMatchedField(row, fieldMap.받는분성명)
      const phone = getMatchedField(row, fieldMap.받는분전화번호)
      const address = getMatchedField(row, fieldMap.받는분주소)
      const boxCount = getMatchedField(row, fieldMap.박스수량)
      const message = getMatchedField(row, fieldMap.배송메세지)

      const { grade, size, weight, productName } = parseProductName(itemName)

      const unitPrice = getUnitPrice(
        selectedItem.value,
        grade,
        size
      )
      const total = unitPrice ? Number(weight) * Number(boxCount || 1) * unitPrice : 0

      return {
        orderNo: `ORDER-${index + 1}`,
        받는분성명: name,
        받는분전화번호: phone,
        받는분주소: address,
        품목명: itemName,
        박스수량: boxCount,
        배송메세지: message,
        상품명정리: productName,
        단가: unitPrice,
        금액: total,
        item_type: selectedItem.value,
        cleanedName: productName,
        totalPrice: total,
        weight: weight
      }
    })
  }



  watch(filteredPrices, (newVal) => {
    if (newVal.length > 0 && rawRows.value.length > 0) {
      processOrders(rawRows.value)
    }
  })


  //✅ 엑셀 업로드 처리
  const requiredHeaders = [
    '주문번호',
    '받는분성명',
    '받는분전화번호',
    '받는분주소',
    '품목명',
    '배송메세지',
    '박스수량'
  ]

  const handleExcelUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // ✅ 공급자, 품목 선택 여부 확인
    if (!selectedProvider.value || !selectedItem.value) {
      const toastEl = document.getElementById('toast-warning')
      const toast = new Toast(toastEl)
      toast.show()
      event.target.value = '' // ✅ 파일 선택값 초기화!
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

      // ✅ 필수 헤더 체크
      const actualHeaders = Object.keys(json[0] || {})
      const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h))

      if (missingHeaders.length > 0) {
        alert(`❗ 필수 항목이 누락되었습니다:\n${missingHeaders.join(', ')}`)
        return
      }

      processOrders(json)
    }

    reader.readAsArrayBuffer(file)
  }

  // 업로드된 엑셀 초기화 선택 버튼
  const resetExcel = () => {
    rawRows.value = []
    processedOrders.value = []
  }

  return {
    rawRows,
    processedOrders,
    handleExcelUpload,
    resetExcel // 🔁 꼭 리턴!
  }
}