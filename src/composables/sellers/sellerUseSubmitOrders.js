import { supabase } from '@/lib/supabase'

export function useSubmitOrders() {
  // 🔸 현재 날짜 형식: YYYYMMDD
  const getTodayStr = () => {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${yyyy}${mm}${dd}`
  }

  // 🔹 기존 order_number 중 최대 순번 구하기
  const generateOrderNumbers = async (sellerId, count) => {
    const todayStr = getTodayStr()

    const { data, error } = await supabase
      .from('seller_orders')
      .select('order_number')
      .eq('seller_id', sellerId)
      .like('order_number', `${todayStr}-%`)

    let maxNum = 0
    if (data && data.length > 0) {
      const nums = data
        .map(d => parseInt(d.order_number.split('-')[1]))
        .filter(n => !isNaN(n))
      maxNum = Math.max(...nums, 0)
    }

    return Array.from({ length: count }, (_, i) => `${todayStr}-${maxNum + i + 1}`)
  }

  // ✅ 주문 전송 메인 함수
  const submitOrders = async (orders, sellerId, providerName) => {
    const orderNumbers = await generateOrderNumbers(sellerId, orders.length)

    const payload = orders.map((row, index) => ({
      raw_data: row,
      seller_id: sellerId,
      order_number: orderNumbers[index],
      recipient_name: row.받는분성명,
      recipient_phone: row.받는분전화번호,
      recipient_address: row['받는분주소'],
      item_name: row.품목명,
      box_count: row.박스수량,
      delivery_message: row.배송메세지,
      parsed_name: row.cleanedName,
      amount: row.totalPrice,
      item_type: row.item_type,
      provider_name: providerName
    }))
    console.log('🥡 주문 payload:', payload)

    const { data, error } = await supabase
      .from('seller_orders')
      .insert(payload)

    return { data, error }
  }

  return { submitOrders }
}