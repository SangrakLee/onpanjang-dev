<script>
import { Icon } from '@iconify/vue';
import { useAppOptionStore } from '@/stores/app-option';
import highlightjs from '@/components/plugins/Highlightjs.vue';
import { Offcanvas } from 'bootstrap';

const appOption = useAppOptionStore();

export default {
	components: {
		Icon: Icon,
		highlightjs: highlightjs
	},
	data() {
    return {
    	aiChatSidebar: null,
      activeTab: 'aiChatIntro',
      userInput: '',
      messages: [],
      code: `<script>
  export default {
    async mounted() {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      console.log(data);
    }
  }
<\/script>`};
  },
	mounted() {
		appOption.appContentFullHeight = true;
		appOption.appContentClass = 'p-3';
		this.aiChatSidebar = new Offcanvas(this.$refs.aiChatSidebar);
	},
	beforeRouteLeave (to, from, next) {
		appOption.appContentFullHeight = false;
		appOption.appContentClass = '';
		next();
	},
	methods: {
		toggleAiTab(tabActive, input, event) {
      this.activeTab = tabActive;
			
			if (tabActive === 'aiChatPrev') {
				const elm = event.currentTarget.closest('div');
				if (elm) {
					elm.classList.toggle('bg-light');
				}
				document.querySelectorAll('[data-toggle-ai-tab="aiChatPrev"]').forEach(el => {
					if (el !== event.currentTarget) {
						el.closest('div')?.classList.remove('bg-light');
					}
				});
			} else {
				document.querySelectorAll('[data-toggle-ai-tab="aiChatPrev"]').forEach(el => {
					el.closest('div')?.classList.remove('bg-light');
				});
			}
			
      if (input) {
				this.aiSendMessage(input);
			}
			if (tabActive == 'aiChatIntro') {
				this.$nextTick(this.scrollToTop);
			} else {
				this.$nextTick(this.scrollToBottom);
			}
			
			if (this.aiChatSidebar) {
        this.aiChatSidebar.hide();
      }
    },
    handleKeyPress(event) {
      if (event.key === 'Enter' && this.userInput.trim()) {
        this.toggleAiTab('aiChatNew', this.userInput);
    		this.userInput = '';
      }
    },
    aiSendMessage(input) {
    	if (!input.trim()) return;

      this.messages.push({
        text: input,
        type: 'user'
      });

      this.userInput = '';

      this.$nextTick(this.scrollToBottom);

      this.messages.push({ type: 'loading' });

      setTimeout(() => {
        this.messages = this.messages.filter(msg => msg.type !== "loading");

        const aiResponses = [
          'That\'s an interesting question! Let me think...',
          'Good point! What else do you think about this?',
          'That makes sense. Can you clarify a bit more?',
          'Great perspective! Here’s my take on it...',
          'Good question! I believe the answer is...',
          'I appreciate your input! Let’s explore this further.',
          'That\'s a unique thought! Here’s another angle to consider...',
          'Nice one! Have you considered looking at it from this perspective?',
        ];
        const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        this.messages.push({
          text: aiResponse,
          type: 'ai',
        });

        this.$nextTick(this.scrollToBottom);
      }, 2000);
    },
    scrollToBottom() {
      if (this.$refs.scrollBarRef) {
        this.$refs.scrollBarRef.$el.scrollTop = this.$refs.scrollBarRef.$el.scrollHeight;
      }
    },
    scrollToTop() {
      if (this.$refs.scrollBarRef) {
        this.$refs.scrollBarRef.$el.scrollTop = 0;
      }
    }
	}
}
</script>

<template>
	<!-- BEGIN card -->
	<Card class="h-100" style="z-index: 1020;">
		<div class="d-flex h-100">
			<a class="d-lg-none btn btn-lg bg-inverse bg-opacity-15 bg-blur-2 text-body rounded-0 z-3 ms-1px mt-5 shadow-lg position-absolute top-0 start-0 " data-bs-toggle="offcanvas" href="#aiChatSidebar" role="button" aria-controls="offcanvasExample">
				<i class="fa fa-gear"></i>
			</a>
			<!-- BEGIN ai-chat-sidebar -->
			<div ref="aiChatSidebar" class="w-300px offcanvas offcanvas-start bg-none position-lg-relative transform-lg-none visibility-lg-initial z-lg-3" id="aiChatSidebar">
				<!-- BEGIN ai-chat-sidebar-mobile-bg -->
				<div class="d-lg-none bg-blur-3 d-block position-absolute top-0 end-0 w-100 h-100"></div>
				<!-- END ai-chat-sidebar-mobile-bg -->
				
				<!-- BEGIN ai-chat-sidebar-content -->
				<div class="position-relative h-100 d-flex flex-column">
					<!-- BEGIN ai-chat-new-btn -->
					<div class="p-3">
						<button type="button" class="btn btn-outline-theme w-100 rounded-3 py-2 d-flex align-items-center justify-content-center" @click="toggleAiTab('aiChatIntro')" data-toggle-ai-tab="aiChatIntro">
							New Chat
						</button>
					</div>
					<!-- END ai-chat-new-btn -->
					
					<hr class="m-0 opacity-20" />
					
					<!-- BEGIN ai-chat-history -->
					<div class="flex-1 overflow-hidden text-body">
						<!-- BEGIN scrollbar -->
						<perfect-scrollbar class="p-3 h-100">
							<div class="fw-500 mb-1 d-flex align-items-center">
								<Icon icon="solar:calendar-bold-duotone" class="fs-16px me-8px mt-n1 text-theme"></Icon> 
								Today
							</div>
							<div class="px-2">
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Plan My Dream Vacation</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Craft a Winning Pitch</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Organize My Day</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Write Custom Code</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Draft a Polished Email</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Brainstorm Ideas</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
							</div>
								
							<div class="fw-500 mb-1 d-flex align-items-center mt-3">
								<Icon icon="solar:calendar-bold-duotone" class="fs-16px me-8px mt-n1 text-theme"></Icon>
								1 Week Ago
							</div>
							<div class="px-2">
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Summarize an Article</div><a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Prepare for a Speech</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Create a Business Proposal</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
							</div>
							
							<div class="fw-500 mb-1 d-flex align-items-center mt-3">
								<Icon icon="solar:calendar-bold-duotone" class="fs-16px me-8px mt-n1 text-theme"></Icon> 
								2 Weeks Ago
							</div>
							<div class="px-2">
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Organize Project Tasks</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Research Market Trends</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
								<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
									<div class="flex-1 text-body text-opacity-75">Craft Social Media Posts</div>
									<a href="#" class="stretched-link" @click="toggleAiTab('aiChatPrev', null, $event)" data-toggle-ai-tab="aiChatPrev"></a>
									<div class="dropdown position-relative z-3">
										<a href="#" data-bs-toggle="dropdown" class="link-secondary opacity-50 d-none hover-show-elm"><i class="fa fa-ellipsis"></i></a>
										<div class="dropdown-menu">
											<a href="#" class="dropdown-item">Share Chat</a>
											<a href="#" class="dropdown-item">See Details</a>
											<div class="dropdown-divider"></div>
											<a href="#" class="dropdown-item">Rename</a>
											<a href="#" class="dropdown-item">Archive</a>
											<a href="#" class="dropdown-item">Delete</a>
										</div>
									</div>
								</div>
							</div>
						</perfect-scrollbar>
						<!-- END scrollbar -->
					</div>
					<!-- END ai-chat-history -->
					
					<hr class="m-0 opacity-20" />
					
					<!-- BEGIN ai-chat-info -->
					<div class="fs-6 p-2">
						<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
							<i class="far fa-folder fa-lg fa-fw me-2 ms-n2"></i>
							Explore Bots
						</div>
						<div class="position-relative hover-bg-light bg-opacity-25 hover-show rounded-2 py-6px px-3 border-0 d-flex align-items-center">
							<i class="far fa-gem fa-lg fa-fw me-2 ms-n2"></i>
							Go Pro
						</div>
					</div>
					<!-- END ai-chat-info -->
					
					<hr class="m-0 opacity-20" />
					
					<!-- BEGIN ai-chat-user-info -->
					<div class="rounded-4 px-3 py-3 border-0">
						<div class="fw-500 flex-1 fs-13px text-body d-flex align-items-center">
							<div class="w-30px h-30px fs-20px me-2 rounded-circle text-white bg-inverse bg-opacity-50 d-flex align-items-center justify-content-center">
								S
							</div>
							support@seantheme.com
						</div>
					</div>
					<!-- END ai-chat-user-info -->
				</div>
				<!-- END ai-chat-sidebar-content -->
			</div>
			<!-- END ai-chat-sidebar -->
			
			<!-- BEGIN ai-chat-content -->
			<div class="flex-1 d-flex flex-column h-100 mw-100">
				<!-- BEGIN ai-chat-tabs -->
				<div class="flex-1 overflow-hidden w-100 h-100">
					<perfect-scrollbar ref="scrollBarRef" class="p-2 p-lg-4 tab-content h-100">
					<!-- BEGIN ai-chat-intro -->
					<div id="aiChatIntro" class="tab-pane fade px-3 px-lg-4 py-2" :class="{ show: activeTab === 'aiChatIntro', active: activeTab === 'aiChatIntro' }" v-if="activeTab === 'aiChatIntro'">
						<div class="fs-1 lh-sm mb-0">
							<span class="text-body fw-bold">Hello, there</span>
						</div>
						<div class="fs-4 lh-sm text-body text-opacity-75 mb-4">How can I assist you today?</div>
						<div class="row g-4">
							<div class="col-sm-6 col-xl-4">
								<!-- BEGIN card -->
								<a class="card cursor-pointer h-100 text-decoration-none text-body text-opacity-75" @click="toggleAiTab('aiChatNew', 'Suggest hidden gems and must-see spots for my next trip.')">
									<div class="card-body p-4">
										<div class="mb-3 d-flex">
											<Icon icon="solar:calendar-date-bold-duotone" class="fs-40px"></Icon>
										</div>
										<div class="fw-500 text-body mb-1">Plan My Adventure</div>
										<div class="">Suggest hidden gems and must-see spots for my next trip.</div>
									</div>
									
									<!-- BEGIN card-arrow -->
									<div class="card-arrow">
										<div class="card-arrow-top-left"></div>
										<div class="card-arrow-top-right"></div>
										<div class="card-arrow-bottom-left"></div>
										<div class="card-arrow-bottom-right"></div>
									</div>
									<!-- END card-arrow -->
								</a>
								<!-- END card -->
							</div>
							<div class="col-sm-6 col-xl-4">
								<!-- BEGIN card -->
								<a class="card cursor-pointer h-100 text-decoration-none text-body text-opacity-75" @click="toggleAiTab('aiChatNew', 'Create a concise and professional response for any situation.')">
									<div class="card-body p-4">
										<div class="mb-3 d-flex">
											<Icon icon="solar:chat-square-arrow-bold-duotone" class="fs-40px"></Icon>
										</div>
										<div class="fw-500 text-body mb-1">Draft a Quick Reply</div>
										<div class="">Create a concise and professional response for any situation.</div>
									</div>
									
									<!-- BEGIN card-arrow -->
									<div class="card-arrow">
										<div class="card-arrow-top-left"></div>
										<div class="card-arrow-top-right"></div>
										<div class="card-arrow-bottom-left"></div>
										<div class="card-arrow-bottom-right"></div>
									</div>
									<!-- END card-arrow -->
								</a>
								<!-- END card -->
							</div>
							<div class="col-sm-6 col-xl-4">
								<!-- BEGIN card -->
								<a class="card cursor-pointer h-100 text-decoration-none text-body text-opacity-75" @click="toggleAiTab('aiChatNew', 'Break down complex ideas into simple, easy-to-understand explanations.')">
									<div class="card-body p-4">
										<div class="mb-3 d-flex">
											<Icon icon="solar:layers-minimalistic-bold-duotone" class="fs-40px"></Icon>
										</div>
										<div class="fw-500 text-body mb-1">Simplify This</div>
										<div class="">Break down complex ideas into simple, easy-to-understand explanations.</div>
									</div>
									
									<!-- BEGIN card-arrow -->
									<div class="card-arrow">
										<div class="card-arrow-top-left"></div>
										<div class="card-arrow-top-right"></div>
										<div class="card-arrow-bottom-left"></div>
										<div class="card-arrow-bottom-right"></div>
									</div>
									<!-- END card-arrow -->
								</a>
								<!-- END card -->
							</div>
							<div class="col-sm-6 col-xl-4">
								<!-- BEGIN card -->
								<a class="card cursor-pointer h-100 text-decoration-none text-body text-opacity-75" @click="toggleAiTab('aiChatNew', 'Write and troubleshoot code with smart fixes for tricky errors.')">
									<div class="card-body p-4">
										<div class="mb-3 d-flex">
											<Icon icon="solar:code-bold-duotone" class="fs-40px"></Icon>
										</div>
										<div class="fw-500 text-body mb-1">Code & Debug</div>
										<div class="">Write and troubleshoot code with smart fixes for tricky errors.</div>
									</div>
									
									<!-- BEGIN card-arrow -->
									<div class="card-arrow">
										<div class="card-arrow-top-left"></div>
										<div class="card-arrow-top-right"></div>
										<div class="card-arrow-bottom-left"></div>
										<div class="card-arrow-bottom-right"></div>
									</div>
									<!-- END card-arrow -->
								</a>
								<!-- END card -->
							</div>
							<div class="col-sm-6 col-xl-4">
								<!-- BEGIN card -->
								<a class="card cursor-pointer h-100 text-decoration-none text-body text-opacity-75" @click="toggleAiTab('aiChatNew', 'Generate fresh ideas for projects, names, or creative solutions.')">
									<div class="card-body p-4">
										<div class="mb-3 d-flex">
											<Icon icon="solar:lightbulb-bolt-bold-duotone" class="fs-40px"></Icon>
										</div>
										<div class="fw-500 text-body mb-1">Brainstorm Anything</div>
										<div class="">Generate fresh ideas for projects, names, or creative solutions.</div>
									</div>
									
									<!-- BEGIN card-arrow -->
									<div class="card-arrow">
										<div class="card-arrow-top-left"></div>
										<div class="card-arrow-top-right"></div>
										<div class="card-arrow-bottom-left"></div>
										<div class="card-arrow-bottom-right"></div>
									</div>
									<!-- END card-arrow -->
								</a>
								<!-- END card -->
							</div>
							<div class="col-sm-6 col-xl-4">
								<!-- BEGIN card -->
								<a class="card cursor-pointer h-100 text-decoration-none text-body text-opacity-75" @click="toggleAiTab('aiChatNew', 'Craft emails, reports, or social posts in a polished, clear tone.')">
									<div class="card-body p-4">
										<div class="mb-3 d-flex">
											<Icon icon="solar:pen-2-bold-duotone" class="fs-40px"></Icon>
										</div>
										<div class="fw-500 text-body mb-1">Write It for Me</div>
										<div class="">Craft emails, reports, or social posts in a polished, clear tone.</div>
									</div>
									
									<!-- BEGIN card-arrow -->
									<div class="card-arrow">
										<div class="card-arrow-top-left"></div>
										<div class="card-arrow-top-right"></div>
										<div class="card-arrow-bottom-left"></div>
										<div class="card-arrow-bottom-right"></div>
									</div>
									<!-- END card-arrow -->
								</a>
								<!-- END card -->
							</div>
						</div>
					</div>
					<!-- END ai-chat-intro -->
					
					<!-- BEGIN ai-chat-prev -->
					<div id="aiChatPrev" class="tab-pane fade px-sm-3 px-lg-4 py-2" :class="{ show: activeTab === 'aiChatPrev', active: activeTab === 'aiChatPrev' }" v-if="activeTab === 'aiChatPrev'">
						<!-- BEGIN chat-human -->
						<div class="d-flex justify-content-end align-items-end mb-3">
							<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
								Can you generate some content for social media captions?
							</div>
							<div>
								<div class="w-30px h-30px my-2px ms-2 fs-20px me-2 rounded-circle text-white bg-inverse bg-opacity-50 d-flex align-items-center justify-content-center">
									S
								</div>
							</div>
						</div>
						<!-- END chat-human -->
						
						<!-- BEGIN chat-ai -->
						<div class="mb-3">
							<div class="d-flex justify-content-start align-items-end">
								<div>
									<div class="w-30px h-30px my-2px ms-2 fs-16px me-2 rounded-circle bg-theme bg-opacity-15 text-theme d-flex align-items-center justify-content-center">
										<i class="fa fa-shekel-sign"></i>
									</div>
								</div>
								<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
									<div>Absolutely! What’s the topic or product?</div>
								</div>
							</div>
							<div class="d-flex">
								<div class="w-30px h-30px me-2 ms-2"></div>
								<div class="d-flex flex-wrap w-100 p-2 opacity-75">
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-copy"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-thumbs-up"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-thumbs-down"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="fa fa-fw fa-microphone"></i></a>
									<a href="#" class="link-secondary text-decoration"><i class="fa fa-fw fa-arrow-rotate-right"></i></a>
								</div>
							</div>
						</div>
						<!-- END chat-ai -->

						<!-- BEGIN chat-human -->
						<div class="d-flex justify-content-end align-items-end mb-3">
							<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
								Let’s say… a coffee shop promotion.
							</div>
							<div>
								<div class="w-30px h-30px my-2px ms-2 fs-20px me-2 rounded-circle text-white bg-inverse bg-opacity-50 d-flex align-items-center justify-content-center">
									S
								</div>
							</div>
						</div>
						<!-- END chat-human -->
						
						<!-- BEGIN chat-ai -->
						<div class="mb-3">
							<div class="d-flex justify-content-start align-items-end">
								<div>
									<div class="w-30px h-30px my-2px ms-2 fs-16px me-2 rounded-circle bg-theme bg-opacity-15 text-theme d-flex align-items-center justify-content-center">
										<i class="fa fa-shekel-sign"></i>
									</div>
								</div>
								<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
									<div>How about these:</div>
									<ol class="my-2 ps-4">
										<li>Start your day with the perfect brew – 20% off all lattes today!</li>
										<li>Coffee first, everything else later. Grab your cup now!</li>
										<li>A little caffeine, a lot of happiness. Visit us for your daily fix!</li>
									</ol>
									<div>Need more options?</div>
								</div>
							</div>
							<div class="d-flex">
								<div class="w-30px h-30px me-2 ms-2"></div>
								<div class="d-flex flex-wrap w-100 p-2 opacity-75">
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-copy"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-thumbs-up"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-thumbs-down"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="fa fa-fw fa-microphone"></i></a>
									<a href="#" class="link-secondary text-decoration"><i class="fa fa-fw fa-arrow-rotate-right"></i></a>
								</div>
							</div>
						</div>
						<!-- END chat-ai -->

						<!-- BEGIN chat-human -->
						<div class="d-flex justify-content-end align-items-end mb-3">
							<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
								How can I fetch API data in Vue.js?
							</div>
							<div>
								<div class="w-30px h-30px my-2px ms-2 fs-20px me-2 rounded-circle text-white bg-inverse bg-opacity-50 d-flex align-items-center justify-content-center">
									S
								</div>
							</div>
						</div>
						<!-- END chat-human -->
						
						<!-- BEGIN chat-ai -->
						<div class="mb-3">
							<div class="d-flex justify-content-start align-items-end">
								<div>
									<div class="w-30px h-30px my-2px ms-2 fs-16px me-2 rounded-circle bg-theme bg-opacity-15 text-theme d-flex align-items-center justify-content-center">
										<i class="fa fa-shekel-sign"></i>
									</div>
								</div>
								<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
									Here’s a simple example:
									<div class="card my-2">
										<div class="card-header d-flex border-0">
											<span class="flex-1">vue</span>
											<span><a href="#" class="text-body text-decoration-none"><i class="far fa-copy"></i> Copy</a></span>
										</div>
										<highlightjs :code="code" />
		
										<!-- BEGIN card-arrow -->
										<div class="card-arrow">
											<div class="card-arrow-top-left"></div>
											<div class="card-arrow-top-right"></div>
											<div class="card-arrow-bottom-left"></div>
											<div class="card-arrow-bottom-right"></div>
										</div>
										<!-- END card-arrow -->
									</div>
									Would you like me to explain how this works?
								</div>
							</div>
							<div class="d-flex">
								<div class="w-30px h-30px me-2 ms-2"></div>
								<div class="d-flex flex-wrap w-100 p-2 opacity-75">
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-copy"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-thumbs-up"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="far fa-fw fa-thumbs-down"></i></a>
									<a href="#" class="link-secondary text-decoration me-2"><i class="fa fa-fw fa-microphone"></i></a>
									<a href="#" class="link-secondary text-decoration"><i class="fa fa-fw fa-arrow-rotate-right"></i></a>
								</div>
							</div>
						</div>
						<!-- END chat-ai -->
					</div>
					<!-- END ai-chat-prev -->
					
					<!-- BEGIN ai-chat-new -->
					<div id="aiChatNew" class="tab-pane fade px-sm-3 px-lg-4 py-2" :class="{ show: activeTab === 'aiChatNew', active: activeTab === 'aiChatNew' }" v-if="activeTab === 'aiChatNew'">
						<div v-for="(message, index) in messages" :key="index">
							<div v-if="message.type === 'user'" class="d-flex justify-content-end align-items-end mb-3">
								<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
									{{ message.text }}
								</div>
								<div>
									<div class="w-30px h-30px my-2px ms-2 fs-20px me-2 rounded-circle text-white bg-inverse bg-opacity-50 d-flex align-items-center justify-content-center">
										S
									</div>
								</div>
							</div>
				
							<div v-else-if="message.type === 'loading'" class="d-flex justify-content-start mb-3 ai-spinner">
								<div class="px-2 py-1"><div class="spinner-grow spinner-grow-sm"></div></div>
							</div>
				
							<div v-else class="d-flex justify-content-start align-items-end mb-3">
								<div>
									<div class="w-30px h-30px my-2px ms-2 fs-16px me-2 rounded-circle bg-theme bg-opacity-15 text-theme d-flex align-items-center justify-content-center">
										<i class="fa fa-shekel-sign"></i>
									</div>
								</div>
								<div class="rounded-4 px-3 py-2 bg-inverse bg-opacity-10 text-body mw-75">
									<div class="typing-animation" style="animation-duration: .5s;">{{ message.text }}</div>
								</div>
							</div>
						</div>
					</div>
					<!-- END ai-chat-new -->
					</perfect-scrollbar>
				</div>
				<!-- END ai-chat-tabs -->
				
				<!-- BEGIN ai-chat-input -->
				<div>
					<div class="px-lg-4 px-3 pb-3">
						<div class="position-relative mx-lg-4 mx-2 h-100">
							<div class="position-absolute start-0 bottom-0 p-2">
								<button type="button" class="btn btn-lg px-1 py-1 text-body text-opacity-50"><i class="fa fa-fw fa-plus"></i></button>
								<button type="button" class="btn btn-lg px-1 py-1 text-body text-opacity-50"><i class="fa fa-fw fa-globe"></i></button>
								<button type="button" class="btn btn-lg px-1 py-1 text-body text-opacity-50"><i class="fa fa-fw fa-microphone"></i></button>
							</div>
							<input type="text" class="form-control form-control-lg shadow-none rounded-0" style="padding-bottom: 60px; padding-top: 10px;" id="userInput" v-model="userInput" @keypress="handleKeyPress" placeholder="Message AI Bot" />
							<div class="position-absolute end-0 bottom-0 px-2 pb-2">
								<button id="sendButton" @click="sendMessage" class="btn btn-lg bg-inverse text-inverse bg-opacity-20 rounded-0">
									<i class="fa fa-arrow-right"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- END ai-chat-input -->
			</div>
			<!-- END ai-chat-content -->
		</div>
	</Card>
	<!-- END card -->
</template>