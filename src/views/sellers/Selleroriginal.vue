<template>
  <ul class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">LAYOUT</a></li>
    <li class="breadcrumb-item active">{{ sellerName }}</li>
  </ul>

  <div class="page-header">
    <small>{{ sellerName }}님 오늘도 좋은 하루 되세요 !!</small>
  </div>

  <p class="blockquote-footer">
    <i>주문 하시려는 공급자의 품목을 선택해 주세요</i>
  </p>

  <!-- ✅ 드롭다운 영역 -->
  <div class="btn-toolbar">
    <div class="col-sm-2 btn-group me-2">
      <!-- 공급자 선택 -->
      <select v-model="selectedProvider" class="form-select form-select-sm">
        <option disabled value="">공급업체 선택</option>
        <option
          v-for="provider in providers"
          :key="provider.id"
          :value="provider.provider_name"
        >
          {{ provider.provider_name }}
        </option>
      </select>
    </div>

    <!-- 품목 선택 -->
    <div class="col-sm-2 btn-group me-2">
      <select v-model="selectedItem" class="form-select form-select-sm">
        <option disabled value="">공급품목 선택</option>
        <option v-for="item in providerItems" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>

    <div class="col-sm-2 btn-group me-2">
      <input
        class="form-control form-control-sm"
        type="file"
        ref="excelInput"
        @change="handleExcelUpload"
        accept=".xlsx,.xls"
      />
    </div>
  </div>

  <div class="mt-3">
    <div class="col-sm-2 btn-group me-2">
      <button class="btn btn-outline-danger btn-sm" @click="openResetModal()">
        <i class="fa fa-redo-alt me-3"></i>업로드 초기화
      </button>
    </div>
    <div class="col-sm-2 btn-group">
      <button class="btn btn-outline-theme btn-sm" @click="saveToServer">
        <i class="fa fa-plus-circle me-3"></i>주문서 전송
      </button>
    </div>
  </div>

  <div class="modal fade" id="resetConfirmModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">초기화 확인</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <p>업로드된 주문서를 초기화하시겠습니까?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-bs-dismiss="modal">
            취소
          </button>
          <button
            type="button"
            class="btn btn-outline-theme"
            @click="confirmReset"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="d-flex align-items-center form-control-sm mt-3 ms-3">
    <label class="pe-3">Search:</label>
    <input
      v-model="searchTerm"
      class="form-control w-200px"
      placeholder="Keywords..."
    />
  </div> -->
  <hr class="mb-4" />
  <table
    class="table table-bordered table-xs w-100 fw-bold text-nowrap table-responsive mt-3"
    v-if="processedOrders.length > 0"
  >
    <thead>
      <tr>
        <th>주문번호</th>
        <th>운송장번호</th>
        <th>받는분성명</th>
        <th>받는분전화번호</th>
        <th>받는분주소</th>
        <th>품목명</th>
        <th>배송메세지</th>
        <th>박스수량</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in processedOrders" :key="order.orderNo">
        <td>{{ order.orderNo }}</td>
        <td>{{ order.invoice_number || "-" }}</td>
        <td>{{ order.받는분성명 }}</td>
        <td>{{ order.받는분전화번호 }}</td>
        <td>{{ order.받는분주소 }}</td>
        <td>{{ order.품목명 }}</td>
        <td>{{ order.배송메세지 }}</td>

        <td>{{ order.박스수량 }}</td>
      </tr>
    </tbody>
  </table>

  <div
    class="toast position-absolute top-50 start-50 translate-middle border-danger"
    data-autohide="false"
    id="toast-warning"
  >
    <div class="toast-header">
      <i class="far fa-bell text-muted me-2"></i>
      <strong class="me-auto">Bootstrap</strong>
      <small>5 seconds ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">공급자, 품목을 먼저 선택해 주세요.</div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useAppOptionStore } from "@/stores/app-option";
import { onBeforeUnmount } from "vue";
import { useDropdowns } from "@/composables/sellers/sellerSelectProvider";
import { useSellerOrder } from "@/composables/sellers/sellerOrder";
import { useSubmitOrders } from "@/composables/sellers/sellerUseSubmitOrders";
import { Modal } from "bootstrap";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();
const sellerId = Number(route.params.sellerNumber);
const rawRows = ref([]);
const appOption = useAppOptionStore(); //사이드메뉴

// ✅ 공급자 이름 가져오기
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

onMounted(() => {
  fetchSellerName();
  appOption.appSidebarHide = true;
});

onBeforeUnmount(() => {
  appOption.appSidebarHide = false;
});

// ✅ 공급자/품목 드롭다운 데이터 가져오기
const { selectedProvider, selectedItem, providers, providerItems } =
  useDropdowns();
const selectedSeasonDate = ref("");

// useSellerOrder에 인자 넘김
const { processedOrders, handleExcelUpload, resetExcel, processOrders } =
  useSellerOrder(sellerId, selectedItem, selectedProvider);
// 주문서 다시 넣기위해 초기화
const excelInput = ref(null);

const resetAll = () => {
  if (confirm("업로드된 주문서를 초기화하시겠습니까?")) {
    excelInput.value.value = ""; // input 리셋
    resetExcel(); // 데이터 리셋
  }
};
//모달로 초기화 선택창 띄우기
let resetModal = null;
onMounted(() => {
  const modalEl = document.getElementById("resetConfirmModal");
  if (modalEl) {
    resetModal = new Modal(modalEl);
  }
});

const openResetModal = () => {
  if (resetModal) {
    resetModal.show();
  }
};

const confirmReset = () => {
  if (excelInput.value) {
    excelInput.value.value = "";
  }
  resetExcel(); // useSellerOrder()에서 가져온 함수
  resetModal.hide();
};

const { submitOrders } = useSubmitOrders();

const saveToServer = async () => {
  if (processedOrders.value.length === 0) {
    alert("⛔ 먼저 엑셀을 업로드해주세요!");
    return;
  }

  // ✅ item_type 누락된 항목 있는지 체크
  const hasMissingItemType = processedOrders.value.some(
    (order) => !order.item_type
  );
  if (hasMissingItemType) {
    alert(
      "❗ item_type이 누락된 주문이 있어 저장할 수 없습니다.\n품목명에 '참외', '방울토마토' 등 키워드가 포함되어 있는지 확인해주세요."
    );
    return;
  }

  const { error } = await submitOrders(
    processedOrders.value,
    sellerId,
    selectedProvider.value
  );

  if (error) {
    console.error("🛑 주문 저장 오류:", error);
    alert("❌ 저장에 실패했습니다!");
  } else {
    alert("✅ 주문이 저장되었습니다!");
  }
};
// 주문서 미리보기 //

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

  if (error) {
    console.error("❌ 미리보기 로드 실패:", error);
    return;
  }

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
</script>