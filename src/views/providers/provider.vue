<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useAppOptionStore } from "@/stores/app-option";
import { onBeforeUnmount } from "vue";
import { useOrderSummary } from "@/composables/providers/useOrderSummary";

const appOption = useAppOptionStore(); // 사이드 메뉴

const route = useRoute();
const router = useRouter();
const providerId = ref(route.params.providerNumber);
const providerName = ref("");
const today = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ✅ 공급자 이름 가져오기
const { itemSummary, orders, loading, fetchTodaySummaryByProvider } =
  useOrderSummary();

const fetchProviderName = async () => {
  const { data, error } = await supabase
    .from("providers")
    .select("provider_name")
    .eq("number", providerId.value)
    .single();
  if (error || !data) {
    console.error("ID 정보 조회 오류", error);
    router.replace("/some-weird-path-that-doesn’t-exist");
  } else {
    providerName.value = data.provider_name;
    await fetchTodaySummaryByProvider(providerName.value); // ✅ 요약 데이터 불러오기
  }
};
onMounted(() => {
  appOption.appSidebarHide = true;
  fetchProviderName();
});

onBeforeUnmount(() => {
  appOption.appSidebarHide = false;
});
</script>
<template>
  <ul class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">LAYOUT</a></li>
    <li class="breadcrumb-item active">{{ providerName }}</li>
  </ul>
  {{ today }} / 주문량 요약
  <hr class="mb-4" />
  <div class="d-flex">
    <div class="col-sm-3">
      <span class="ms-3 text-danger"><i>참외</i></span>
      <table
        class="table table-striped tab-content table-bordered mt-2"
        v-if="itemSummary['참외']"
      >
        <tbody>
          <tr v-for="item in itemSummary['참외']" :key="item.item_name">
            <td class="text-center">{{ item.item_name }}</td>
            <td class="text-center">{{ item.total_kg.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-sm-3 ms-3">
      <span class="ms-3 text-danger"><i>토마토</i></span>
      <table
        class="table table-striped tab-content table-bordered mt-2"
        v-if="itemSummary['토마토']"
      >
        <tbody>
          <tr v-for="item in itemSummary['토마토']" :key="item.item_name">
            <td class="text-center">{{ item.item_name }}</td>
            <td class="text-center">{{ item.total_kg.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>