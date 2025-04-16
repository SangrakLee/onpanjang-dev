<template>
  <div class="container mt-4">
    <h4 class="fw-bold mb-3">📦 오늘 등록된 주문서 미리보기</h4>

    <div class="d-flex justify-content-between mb-3">
      <div>
        <button class="btn btn-success me-2" @click="downloadCustomExcel">
          ⬇️ 커스텀 양식 다운로드
        </button>
        <button class="btn btn-outline-danger" @click="closeOrders">
          🛑 주문 마감
        </button>
      </div>
      <div>
        <label for="invoiceExcel" class="btn btn-primary mb-0">
          📮 운송장 엑셀 업로드
        </label>
        <input
          id="invoiceExcel"
          type="file"
          accept=".xlsx,.xls"
          class="d-none"
          @change="handleInvoiceUpload"
        />
      </div>
    </div>

    <div v-if="processedOrders.length === 0">
      <div class="alert alert-warning">오늘 등록된 주문이 없습니다.</div>
    </div>

    <div v-else>
      <table class="table table-bordered table-hover">
        <thead class="table-light text-center">
          <tr>
            <th>업체명</th>
            <th>주문번호</th>
            <th>상품명</th>
            <th>수량</th>
            <th>금액</th>
            <th>운송장번호</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in processedOrders" :key="order.order_number">
            <td>{{ order.sellers?.seller_name || "-" }}</td>
            <td>{{ order.order_number }}</td>
            <td>{{ order.parsed_name }}</td>
            <!-- 정제된 상품명 -->
            <td>{{ order.box_count }}</td>
            <td>{{ order.amount?.toLocaleString?.() || "-" }}</td>
            <td>{{ order.invoice_number || "-" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { supabase } from "@/lib/supabase";
import {
  useProviderOrder,
  saveProcessedOrders,
} from "@/composables/providers/useProviderOrder";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const orders = ref([]);
const filteredPrices = ref([]);
const selectedProvider = ref("");
const discounts = ref([]);
const deliveryFees = ref({});
const paymentSettings = ref({});

const fetchFilteredPrices = async () => {
  const { data, error } = await supabase
    .from("v_provider_product_prices")
    .select("*");

  if (error) {
    console.error("❌ 단가 조회 실패:", error);
  } else {
    filteredPrices.value = data;
  }
};

const parseWeight = (raw) => {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed?.weight || "-";
  } catch {
    return "-";
  }
};

// 🔹 오늘 주문 불러오기
const fetchTodayOrders = async () => {
  const today = dayjs().format("YYYY-MM-DD");

  const { data, error } = await supabase
    .from("seller_orders")
    .select("*, sellers(seller_name, phone), providers(address)")
    .eq("order_date", today);

  if (error) {
    console.error("❌ 주문 불러오기 오류:", error);
  } else {
    rawRows.value = data; // ✅ 수정: 원시 데이터 저장
    processOrders(data); // ✅ 정제된 주문 처리
  }
};

const {
  rawRows,
  processedOrders,
  handleExcelUpload,
  resetExcel,
  processOrders,
} = useProviderOrder(
  filteredPrices,
  selectedProvider,
  discounts,
  deliveryFees,
  paymentSettings
);

const handleInvoiceUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    for (const row of rows) {
      const orderNo = row["주문번호"] || row["order_number"];
      const invoice = row["운송장번호"] || row["invoice_number"];
      if (!orderNo || !invoice) continue;

      await supabase
        .from("seller_orders")
        .update({ invoice_number: invoice })
        .eq("order_number", orderNo);
    }

    alert("📮 운송장 엑셀 업로드 완료");
    fetchTodayOrders();
    event.target.value = "";
  };

  reader.readAsArrayBuffer(file);
};

const downloadCustomExcel = () => {
  if (processedOrders.value.length === 0) return;
  const rows = [];
  processedOrders.value.forEach((order) => {
    const boxCount = Number(order.box_count || 1);
    const sender = order.sellers?.seller_name || "-";
    const senderPhone = order.sellers?.phone || "";
    const senderAddress = order.providers?.address || "";
    const originalItem = order.item_name || "";
    const deliveryMessage = order.delivery_message || "";
    const weight = parseFloat(order.weight || parseWeight(order.raw_data));
    const boxType = getBoxType(weight);
    const parsedName = order.parsed_name || "";
    for (let i = 0; i < boxCount; i++) {
      rows.push({
        보내는분성명: sender,
        보내는분전화번호: senderPhone,
        "보내는분주소(전체, 분할)": senderAddress,
        받는분성명: order.recipient_name || "",
        받는분전화번호: order.recipient_phone || "",
        "받는분주소(전체, 분할)": order.recipient_address || "",
        품목명: originalItem,
        박스수량: 1,
        박스타입: boxType,
        "보내시는 분 / 배송메세지1": deliveryMessage,
        받는분: "",
        운송장번호: order.invoice_number || "",
        주문번호: order.order_number,
        __sort_parsed: parsedName,
      });
    }
  });

  rows.sort((a, b) => a.__sort_parsed.localeCompare(b.__sort_parsed));
  rows.forEach((r) => delete r.__sort_parsed);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "출고지시서");
  XLSX.writeFile(workbook, `출고지시서_${dayjs().format("YYYYMMDD")}.xlsx`);
};

const getBoxType = (weight) => {
  if (weight < 3) return "극소";
  if (weight < 6) return "소";
  return "중";
};

const closeOrders = async () => {
  await saveProcessedOrders(processedOrders, fetchTodayOrders);
};

onMounted(async () => {
  await fetchFilteredPrices(); // ✅ 단가 먼저 불러오기
  await fetchTodayOrders(); // ✅ 그 다음 주문 불러오기
});
watch([filteredPrices, orders], ([prices, raw]) => {
  if (prices.length > 0 && raw.length > 0) {
    processOrders(raw);
    orders.value = processedOrders.value;
  }
});
</script>
