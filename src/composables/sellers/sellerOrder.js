import { ref } from 'vue'
import * as XLSX from 'xlsx'

export function useSellerOrder(sellerId, selectedItem, selectedProvider) {
  const rawRows = ref([])
  const processedOrders = ref([])

  //엑셀 품목 일괄 매핑
  const detectItemType = (itemName) => {
    const keywords = ['참외', '완숙토마토', '방울토마토', '망고', '오렌지'];
    return keywords.find(k => itemName.includes(k)) || '';
  };



  // 🔹 필드 매핑
  const fieldMap = {
    받는분성명: ['받는분성명', '수령인', '받는사람', '수령인명'],
    받는분전화번호: ['받는분전화번호', '연락처', '수령인 휴대폰'],
    받는분주소: ['받는분주소', '주소', '받는분주소(전체, 분할)'],
    품목명: ['품목명', '상품명'],
    박스수량: ['박스수량', '수량'],
    배송메세지: ['배송메세지', '요청사항', '배송메세지1', '배송시 요구사항']
  }

  // 🔹 필드 매칭 함수
  function getMatchedField(row, aliases) {
    for (const key of aliases) {
      if (row[key]) return row[key]
    }
    return ''
  }




  const processOrders = (rows) => {
    rawRows.value = rows;
    const hasMissingItemType = ref(false); // 누락 경고용

    processedOrders.value = rows.map((row) => {
      const itemType = row.item_type || row["품목타입"] || "";
      const isBulk = selectedItem.value === "엑셀 품목 일괄";

      if (isBulk && !itemType) {
        hasMissingItemType.value = true;
      }

      return {
        orderNo:
          row.order_number ||
          row.orderNo ||
          getMatchedField(row, ["주문번호", "order_number"]) ||
          "",
        받는분성명: getMatchedField(row, fieldMap.받는분성명),
        받는분전화번호: getMatchedField(row, fieldMap.받는분전화번호),
        받는분주소: getMatchedField(row, fieldMap.받는분주소),
        품목명: getMatchedField(row, fieldMap.품목명),
        박스수량: getMatchedField(row, fieldMap.박스수량),
        배송메세지: getMatchedField(row, fieldMap.배송메세지),
        item_type: isBulk ? itemType : selectedItem.value,
        invoice_number: row.invoice_number || "",
      };
    });

    if (hasMissingItemType.value) {
      alert(
        '⚠️ "품목타입" 컬럼이 누락된 행이 있습니다.\n엑셀 파일에 "품목타입" 헤더와 값을 꼭 입력해주세요.'
      );
    }
  };


  const handleExcelUpload = (event) => {
    // 🔸 공급자 & 품목 선택 여부 확인

    if (!selectedProvider.value || !selectedItem.value) {
      const toastEl = document.getElementById("toast-warning");
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
      return;
    }

    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

      // ✅ 필수 헤더 체크 (엑셀 품목 일괄일 때만)
      const actualHeaders = Object.keys(json[0] || {})
      if (selectedItem.value === '엑셀 품목 일괄') {
        if (!actualHeaders.includes('품목타입')) {
          alert("❗ '품목타입' 헤더가 누락되었습니다.");
          return
        }
      }
      // 기존 로직
      processOrders(json)
    }

    reader.readAsArrayBuffer(file)
  }



  const resetExcel = () => {
    rawRows.value = []
    processedOrders.value = []
  }



  return {
    rawRows,
    processedOrders,
    handleExcelUpload,
    resetExcel,
    processOrders
  }
}
