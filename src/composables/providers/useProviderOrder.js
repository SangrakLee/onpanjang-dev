import { ref } from 'vue'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import { supabase } from '@/lib/supabase'

export async function fetchDeliveryFeesByProvider(providerId) {
  const { data, error } = await supabase
    .from('provider_shipping_costs')
    .select('*')
    .eq('provider_id', providerId)

  if (error) {
    console.error('❌ 배송비 조회 오류:', error)
    return {}
  }

  const result = {}
  data.forEach(fee => {
    result[fee.payment_type] = {
      '1_2kg': fee.range_1_2kg,
      '3_5kg': fee.range_3_5kg,
      '7_10kg': fee.range_7_10kg,
      extra: fee.extra_fee
    }
  })

  return result
}

export function useProviderOrder(filteredPrices, selectedProvider, discounts, deliveryFees, paymentSettings) {
  const rawRows = ref([])
  const processedOrders = ref([])

  const categoryMap = {
    '완숙': '완숙토마토', '방울': '방울토마토', '찰토마토': '완숙토마토',
    '가정용': '가정용', '랜덤': '못난이', '혼합': '못난이', '못난이': '못난이', '공품': '못난이',
    '랜덤혼합': '못난이', '정품': '정품', '프리미엄': '선물용', '선물용': '선물용', '선물': '선물용'
  }

  const sizeMap = {
    '완숙': '혼합과', '방울': '세트',
    '대과': '대과', '중과': '중과', '소과': '소과', '꼬마과': '꼬마과', '로얄': '중과',
    '꼬마': '꼬마과', '한입': '꼬마과', '혼합': '혼합과', '소': '소과', '대': '대과', '랜덤': '혼합과'
  }

  const weightMap = {
    '1kg': '1', '1.5kg': '1.5', '2kg': '2', '3kg': '3', '4kg': '4',
    '5kg': '5', '6kg': '6', '7kg': '7', '8kg': '8', '9kg': '9', '10kg': '10',
    '1k': '1', '1.5k': '1.5', '2k': '2', '3k': '3', '4k': '4',
    '5k': '5', '6k': '6', '7k': '7', '8k': '8', '9k': '9', '10k': '10'
  }

  const getDeliveryFee = (sellerId, totalWeightKg, address = '') => {
    const method = paymentSettings.value?.[sellerId] || '당일결제'
    const base = deliveryFees.value?.[method] || {}

    let fee = 0
    if (totalWeightKg <= 2) fee = base["1_2kg"] || 0
    else if (totalWeightKg <= 5) fee = base["3_5kg"] || 0
    else fee = base["7_10kg"] || 0

    if (/제주|도서|산간/.test(address)) fee += base.extra || 0

    return fee
  }

  const parseProductName = (originalName = '') => {
    const cleanedName = originalName.toLowerCase().replace(/\s/g, '')
    let grade = '', size = '', weight = ''

    for (const key in categoryMap) {
      if (cleanedName.includes(key)) {
        grade = categoryMap[key]
        break
      }
    }

    for (const key in sizeMap) {
      if (cleanedName.includes(key)) {
        size = sizeMap[key]
        break
      }
    }

    for (const key in weightMap) {
      if (cleanedName.includes(key)) {
        weight = weightMap[key]
        break
      }
    }

    const result = {
      grade: grade || '기타',
      size: size || '기타사이즈',
      weight: weight || '0',
      productName: `${grade || '기타'} ${size || '기타사이즈'} ${weight || '0'}kg`,
      hasError: !grade || !size || !weight
    }
    return result
  }

  const parseMixItems = (mixString) => {
    const parts = mixString
      .replace(/믹스\s?/i, '')
      .split(',')
      .map(str => str.trim())

    return parts.map(part => {
      const match = part.match(/(.+?)\s(\d+)(kg|KG)/i)
      if (!match) return null

      const itemName = match[1].trim()
      const weight = Number(match[2])

      return {
        parsed_name: itemName,
        weight
      }
    }).filter(Boolean)
  }

  const getUnitPrice = (itemName, grade, size, sellerId, productId) => {
    const matching = filteredPrices.value
      .filter(p =>
        p.item_name.trim() === itemName.trim() &&
        p.grade.trim() === grade.trim() &&
        p.size.trim() === size.trim()
      )
      .sort((a, b) => new Date(b.season_date) - new Date(a.season_date))

    const match = matching[0]
    if (!match) return null

    const basePrice = match.price
    const discount = discounts?.value?.find(
      d => d.seller_id === sellerId &&
        d.provider_product_id === match.id &&
        d.is_active
    )
    const discountAmount = discount ? discount.discount_amount : 0

    return basePrice - discountAmount
  }

  const processOrders = (rows) => {
    rawRows.value = rows;

    processedOrders.value = rows.map((row) => {
      const itemName = row.품목명 || row.item_name;
      const boxCount = Number(row.박스수량 || row.box_count || 1);
      const sellerId = row.seller_id;
      const address = row.받는분주소 || row.recipient_address || '';
      const itemType = row.item_type || '';

      let totalWeight = 0;
      let mixTotal = 0;
      let parsed_name = '';
      let unit_price = null;
      let amount = null;

      // ✅ 믹스박스인 경우
      if (/믹스/i.test(itemName)) {
        const mixItems = parseMixItems(itemName);
        let mixNames = [];
        let hasError = false;

        mixItems.forEach((mix) => {
          const { grade, size, weight, hasError: error } = parseProductName(mix.parsed_name);
          if (error) hasError = true;
          const price = getUnitPrice(itemType, grade, size, sellerId);
          const itemAmount = price ? mix.weight * boxCount * price : 0;
          mixTotal += itemAmount;
          totalWeight += mix.weight * boxCount;
          mixNames.push(`${grade} ${size} ${mix.weight}kg`);
        });

        parsed_name = `믹스 (${mixNames.join(', ')})`;
        amount = mixTotal;
      }

      // ✅ 일반 상품
      else {
        const { grade, size, weight, productName } = parseProductName(itemName);
        unit_price = getUnitPrice(itemType, grade, size, sellerId);
        parsed_name = productName;
        amount = unit_price ? Number(weight) * boxCount * unit_price + 3500 : null;
        totalWeight = Number(weight) * boxCount;
      }

      return {
        ...row,
        parsed_name,
        unit_price,
        amount,
      };
    });
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

      const processed = processOrders(json)
      orders.value = processed;
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
// 주문번호 등록
export async function generateOrderNumbers(count) {
  const todayStr = dayjs().format("YYYYMMDD");
  const todayDate = dayjs().format("YYYY-MM-DD");

  const { data, error } = await supabase
    .from("seller_orders")
    .select("order_number")
    .eq("order_date", todayDate)
    .like("order_number", `${todayStr}-%`)
    .not("order_number", "is", null);

  if (error) {
    console.error("❌ order_number 조회 실패:", error);
    return [];
  }

  let max = 0;
  if (data?.length > 0) {
    const nums = data
      .map((d) => d.order_number?.split("-")[1])
      .filter(n => !isNaN(n))
      .map(n => parseInt(n));
    max = Math.max(...nums, 0);
  }

  const newNumbers = Array.from({ length: count }, (_, i) => `${todayStr}-${max + i + 1}`);
  return newNumbers;
}

// 정제된 주문 저장 함수
export async function saveProcessedOrders(processedOrders, fetchTodayOrders) {
  const toUpdate = processedOrders.value.filter(o => {
    return o.id && o.parsed_name && (o.unit_price || o.amount);
  });

  const ordersNeedingNumber = toUpdate.filter(o => !o.order_number);
  const generatedNumbersMap = {};

  if (ordersNeedingNumber.length > 0) {
    const sellerId = ordersNeedingNumber[0].seller_id;
    const newOrderNumbers = await generateOrderNumbers(ordersNeedingNumber.length);
    ordersNeedingNumber.forEach((order, i) => {
      generatedNumbersMap[order.id] = newOrderNumbers[i];
    });
  }

  const payload = toUpdate.map((order) => ({
    id: order.id,
    parsed_name: order.parsed_name,
    unit_price: order.unit_price,
    amount: order.amount,
    order_number: order.order_number || generatedNumbersMap[order.id] || null,
  }));

  const { error } = await supabase
    .from("seller_orders")
    .upsert(payload, { onConflict: ["id"] });

  if (error) {
    console.error("🛑 저장 오류:", error);
    alert("❌ 저장에 실패했습니다.");
  } else {
    alert("✅ 정제 데이터 저장 완료!");
    if (fetchTodayOrders) await fetchTodayOrders();
  }
}