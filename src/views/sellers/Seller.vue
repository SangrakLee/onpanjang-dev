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

    <!-- <div class="col-sm-2 btn-group me-2">
      <input
        class="form-control form-control-sm"
        type="file"
        ref="excelInput"
        @change="handleExcelUpload"
        accept=".xlsx,.xls"
      />
    </div> -->
    <div>
      <button
        @click="handleFileUploadClick"
        type="button"
        class="btn btn-outline-theme btn-sm"
      >
        주문서 업로드
      </button>
      <!-- 숨겨진 파일 input: 보이지 않게 처리 -->
      <input
        type="file"
        ref="excelInput"
        @change="handleExcelUpload"
        style="display: none"
      />

      <div
        class="toast position-absolute top-50 start-50 translate-middle border-danger"
        data-autohide="true"
        data-bs-delay="5000"
        id="toast-warning"
        ref="toastEl"
      >
        <div class="toast-header">
          <i class="far fa-bell text-muted me-2"></i>
          <strong class="me-auto">경고</strong>
          <small>5초 후 닫힘</small>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
          ></button>
        </div>
        <div class="toast-body">공급자와 공급 품목을 먼저 선택해 주세요.</div>
      </div>
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
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useAppOptionStore } from "@/stores/app-option";
import { useSellerPage } from "@/composables/sellers/useSellerPage";
import { Modal, Toast } from "bootstrap";

const route = useRoute();
const sellerId = Number(route.params.sellerNumber);
const appOption = useAppOptionStore(); //사이드바 메뉴 함수ref 선언
const {
  sellerName,
  fetchSellerName,
  selectedProvider,
  selectedItem,
  providers,
  providerItems,
  processedOrders,
  fetchTodayPreviewOrders,
  setExcelInput,
  setToastInstance,
  handleExcelUpload,
  handleFileUploadClick,
  submitOrders,
  resetExcel,
  processOrders,
  fetchProviders,
} = useSellerPage(sellerId);

const toastEl = ref(null);
let toastInstance = null;
let countdownInterval = null; // 토스트 카운트 후 종료 후 이벤트 리스너 여기로

const excelInput = ref(null); // 주문서등록 input에 대한 ref 생성 // 모달 초기화 후에도 여기

onMounted(() => {
  nextTick(() => {
    if (toastEl.value) {
      const toast = new Toast(toastEl.value);
      console.log("Toast 인스턴스 생성됨:", toast);
      // composable에 toast 인스턴스 전달
      setToastInstance(toast);
      // toast가 보여질 때 카운트다운 시작
      toastEl.value.addEventListener("shown.bs.toast", () => {
        let secondsLeft = 5;
        const smallElement = toastEl.value.querySelector("small");
        if (smallElement) {
          smallElement.textContent = `${secondsLeft}초 후 닫힘`;
          countdownInterval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft > 0) {
              smallElement.textContent = `${secondsLeft}초 후 닫힘`;
            } else {
              clearInterval(countdownInterval);
            }
          }, 1000);
        }
      });
      // toast가 숨겨지면 카운트다운 클리어
      toastEl.value.addEventListener("hidden.bs.toast", () => {
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
      });
    } else {
      console.warn("Toast element not found");
    }
  });
  setExcelInput(excelInput);
  fetchSellerName();
  appOption.appSidebarHide = true;
  // ✅ 미리보기 로드
  fetchTodayPreviewOrders();
});

onBeforeUnmount(() => {
  appOption.appSidebarHide = false;
});

// 공급자 공급품목 미선택 에러 토스트
const handleButtonClick = () => {
  if (!selectedProvider.value || !selectedItem.value) {
    console.log("공급자나 품목 미선택 - 토스트 띄움");
    // 버튼 클릭 시점에 toastInstance가 없으면 nextTick으로 다시 확인
    nextTick(() => {
      if (toastInstance) {
        toastInstance.show();
      } else {
        console.warn("Toast instance가 아직 준비되지 않음");
      }
    });
    return;
  }

  console.log("파일 업로드 처리 진행");
  // 파일 업로드 관련 로직을 여기에 추가
};

// 주문서 다시 넣기위해 초기화
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

const saveToServer = async () => {
  if (processedOrders.value.length === 0) {
    alert("⛔ 먼저 엑셀을 업로드해주세요!");
    return;
  }
  const hasMissingItemType = processedOrders.value.some((o) => !o.item_type);
  if (hasMissingItemType) {
    alert("❗ item_type 누락 주문이 있어 저장할 수 없습니다.");
    return;
  }
  const { error } = await submitOrders(processedOrders.value);
  if (!error) alert("✅ 주문이 저장되었습니다!");
};
</script>
