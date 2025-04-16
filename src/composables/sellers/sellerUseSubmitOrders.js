import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'

export function useSubmitOrders() {
  // ✅ 주문 전송 메인 함수 (공란 주문번호 허용)
  const submitOrders = async (orders, sellerId, providerName) => {
    const todayDate = dayjs().format('YYYY-MM-DD')

    // 1. 주문번호 공백 제거
    const trimmedOrders = orders.map(o => ({
      ...o,
      orderNo: o.orderNo ? String(o.orderNo).trim() : ''
    }))

    // 5. 최종 payload 구성
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
      provider_name: providerName,
      order_date: todayDate
    }))

    // 6. Supabase 저장
    const { data, error } = await supabase
      .from('seller_orders')
      .insert(payload)
    if (error) {
      console.error('🛑 주문 저장 오류:', error)
    }

    return { data, error }
  }

  return { submitOrders }
}
