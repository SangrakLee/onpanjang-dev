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
		appOption.appFooterFixed = true;
		appOption.appFooter = true;
		
		axios.get('/assets/data/layout/fixed-footer-code-1.json').then((response) => {
			this.code1 = response.data;
		});
	},
	beforeUnmount() {
		appOption.appFooterFixed = false;
		appOption.appFooter = false;
	}
}
</script>
<template>
	<ul class="breadcrumb">
		<li class="breadcrumb-item"><a href="#">LAYOUT</a></li>
		<li class="breadcrumb-item active">FIXED FOOTER</li>
	</ul>
	
	<h1 class="page-header">
		Fixed Footer <small>page header description goes here...</small>
	</h1>
	
	<hr class="mb-4">
	
	<p>
		Add the following code within the <code>&lt;script&gt;</code> tag for fixed footer page setting.
	</p>
	
	<card>
		<highlightjs :code="code1"></highlightjs>
	</card>
</template>