<script>
import { useAppOptionStore } from '@/stores/app-option';
import highlightjs from '@/components/plugins/Highlightjs.vue';
import axios from 'axios';

const appOption = useAppOptionStore();

export default {
	data() {
		return {
			code1: ''
		}
	},
	components: {
		highlightjs: highlightjs
	},
	mounted() {
		appOption.appTopNav = true;
		appOption.appBoxedLayout = true;
		
		axios.get('/assets/data/layout/mixed-nav-boxed-layout-code-1.json').then((response) => {
			this.code1 = response.data;
		});
	},
	beforeUnmount() {
		appOption.appTopNav = false;
		appOption.appBoxedLayout = false;
	}
}
</script>
<template>
	<ul class="breadcrumb">
		<li class="breadcrumb-item"><a href="#">LAYOUT</a></li>
		<li class="breadcrumb-item active">MIXED NAV BOXED LAYOUT</li>
	</ul>
	
	<h1 class="page-header">
		Mixed Nav Boxed Layout <small>page header description goes here...</small>
	</h1>
	
	<hr class="mb-4">
	
	<p>
		Add the following code within the <code>&lt;script&gt;</code> tag for mixed nav & boxed layout page setting.
	</p>
	
	<card>
		<highlightjs :code="code1"></highlightjs>
	</card>
</template>