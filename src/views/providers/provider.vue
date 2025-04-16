<script setup>
import { useProviderDashboard } from "@/composables/providers/useProviderDashboard";

const {
  providerName,
  availableTypes,
  weightSummary,
  itemSummary,
  orders,
  loading,
  linkedSellers,
  today,
  selectedType,
  sellerOrderSummary,
  sellerItemSummary,
} = useProviderDashboard();
</script>

<template>
  <ul class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">LAYOUT</a></li>
    <li class="breadcrumb-item active">{{ providerName }}</li>
  </ul>
  {{ today }} / 주문량 요약
  <hr class="mb-4" />
  <div class="row">
    <div v-if="loading">로딩 중...</div>

    <div v-else-if="availableTypes.length === 0">❌ 오늘 주문이 없습니다.</div>

    <div v-else class="col-xl-4">
      <card class="border-theme mb-3">
        <!-- ✅ 드롭다운으로 품목 선택 -->
        <label for="itemTypeSelect"
          ><card-header class="form-label card-header fw-bold"
            >품목별 주문 조회</card-header
          ></label
        >
        <card-body>
          <select
            id="itemTypeSelect"
            v-model="selectedType"
            class="form-select form-select-sm"
          >
            <option value="">-- 품목을 선택하세요 --</option>
            <option v-for="type in availableTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>

          <!-- ✅ 선택된 품목 테이블 출력 -->
          <div v-if="selectedType && itemSummary[selectedType]">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th class="text-center">상품명</th>
                  <th class="text-center">10kg 중량</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in itemSummary[selectedType]"
                  :key="item.item_name"
                >
                  <td class="text-center">{{ item.item_name }}</td>
                  <td class="text-center">{{ item.total_kg.toFixed(1) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </card-body>
      </card>
    </div>
    <div class="list-group col-xl-8">
      <a
        href="#"
        class="list-group-item list-group-item-action d-flex align-items-center text-inverse"
        v-for="s in linkedSellers"
        :key="s.seller_id"
      >
        <span
          class="fa fa-circle fs-9px ms-2"
          :class="
            sellerOrderSummary[s.seller_id]?.count > 0
              ? 'text-success'
              : 'text-secondary'
          "
        ></span>

        <div class="flex-fill ps-3 d-flex">
          <div class="fw-bold">
            {{ s.sellers?.seller_name || "-" }}
          </div>
          <div class="small text-muted mx-3">
            <span class="ms-2 small text-muted">
              {{
                sellerOrderSummary[s.seller_id]?.count > 0
                  ? ""
                  : "오늘 주문이 없습니다."
              }}
            </span>
            <span
              v-for="(count, type) in sellerItemSummary[s.seller_id]"
              :key="type"
              >{{ type }}: {{ count }}건 /
              {{
                sellerOrderSummary[s.seller_id]?.total?.toLocaleString() || "0"
              }}원
            </span>
          </div>
        </div>
        <i class="fa fa-chevron-right text-muted"></i>
      </a>
    </div>
  </div>
</template>