<script>
import Masonry from 'masonry-layout';
import { Icon } from '@iconify/vue';

export default {
	components: {
		Icon: Icon
	},
	data() {
    return {
      aiGenerating: false,
      aiGenerated: false,
      previewSrc: null,
      dropdownRatioSelection: 'Ratio',
      dropdownStyleSelection: 'Style'
    };
  },
  methods: {
    generateImage() {
      this.aiGenerating = true;
      this.aiGenerated = false;
      
      this.$nextTick(() => {
        const aiContainer = this.$refs.aiGeneratedContainer;
        if (aiContainer) {
          const aiContainerPosition =
            aiContainer.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: aiContainerPosition - 100, behavior: "smooth" });
        }
      });

      setTimeout(() => {
        this.aiGenerating = false;
        this.aiGenerated = true;
      }, 3000);
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewSrc = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    selectDropdownRatioItem(value) {
      this.dropdownRatioSelection = value;
    },
    selectDropdownStyleItem(value) {
      this.dropdownStyleSelection = value;
    }
  },
	mounted() {
		setTimeout(() => {
			const msnry = new Masonry('[data-masonry]');
		}, 10);
	}
}
</script>

<template>
	<!-- BEGIN ai-generator -->
	<Card class="card mb-4">
		<!-- BEGIN ai-content -->
		<div class="position-relative p-3 p-md-4">
			<!-- BEGIN ai-badge -->
			<span class="position-absolute top-0 start-0 m-3 px-2 fw-bold fs-12px">
				AI IMAGE GENERATOR
			</span>
			<!-- END ai-badge -->
			
			<!-- BEGIN ai-title -->
			<div class="text-center fs-1 fw-500 mt-5 pt-3 text-body">
				Describe your ideas and generate
			</div>
			<!-- END ai-title -->
			
			<!-- BEGIN ai-desc -->
			<div class="text-center fs-5 text-body text-opacity-50 mb-4">Transform your words into visual masterpieces: Leverage AI technology to craft breathtaking images.</div>
			<!-- END ai-desc -->
			
			<!-- BEGIN ai-form -->
			<div class="position-relative mx-auto h-100 w-100 mb-2" style="max-width: 520px;">
				<form @submit.prevent="generateImage">
					<input type="text" class="form-control form-control-lg border-1 shadow-none rounded-3 h-60px" id="userInput" placeholder="Write a prompt to generate" />
					<div class="position-absolute end-0 top-0 bottom-0 d-flex p-10px">
						<button id="sendButton" class="d-flex align-items-center btn btn-lg btn-outline-theme rounded-3 h-auto">
							Generate <i class="fa fa-arrow-right ms-2 mt-1px"></i>
						</button>
					</div>
				</form>
			</div>
			<!-- END ai-form -->
			
			<!-- BEGIN ai-option -->
			<div class="position-relative h-100 w-100 mb-5 pb-3 mx-auto d-flex" style="max-width: 520px;">
				<div class="dropdown me-2">
					<label class="btn btn-sm bg-light bg-opacity-25 border-0 d-flex align-items-center rounded-2 py-5px px-9px">
						<input type="file" class="d-none" accept="image/*" @change="previewImage" />
						<i id="previewIcon" class="fa fa-fw fa-plus me-4px"></i> Upload Image
						<img id="previewImage" v-if="previewSrc" :src="previewSrc" alt="" class="w-20px h-20px me-n1 ms-2 my-n1" />
					</label>
				</div>
				<div class="dropdown me-2 ms-auto">
					<button type="button" data-bs-toggle="dropdown" class="btn btn-sm bg-light bg-opacity-25 border-0 d-flex align-items-center rounded-2 py-5px px-9px"><i class="fa fa-fw fa-globe me-1"></i> <span id="aiRatioText">{{dropdownRatioSelection}}</span> <i class="fa fa-chevron-down fa-fw opacity-50 ms-1"></i></button>
					<div class="dropdown-menu dropdown-menu-end rounded-3">
						<a class="dropdown-item" href="#" @click="selectDropdownRatioItem('Ratio')">None</a>
						<a class="dropdown-item" href="#" @click="selectDropdownRatioItem('1:1 (Square)')">1:1 (Square)</a>
						<a class="dropdown-item" href="#" @click="selectDropdownRatioItem('16:9 (Widescreen)')">16:9 (Widescreen)</a>
						<a class="dropdown-item" href="#" @click="selectDropdownRatioItem('4:3 (Standard)')">4:3 (Standard)</a>
						<a class="dropdown-item" href="#" @click="selectDropdownRatioItem('3:2 (Classic)')">3:2 (Classic)</a>
						<a class="dropdown-item" href="#" @click="selectDropdownRatioItem('21:9 (Ultra Wide)')">21:9 (Ultra Wide)</a>
						<a class="dropdown-item" href="#" @click="selectDropdownRatioItem('9:16 (Portrait)')">9:16 (Portrait)</a>
					</div>
				</div>
				<div class="dropdown">
					<button type="button" data-bs-toggle="dropdown" class="btn btn-sm bg-light bg-opacity-25 border-0 d-flex align-items-center rounded-2 py-5px px-9px"><i class="fa fa-fw fa-palette me-1"></i> <span id="aiStyleText">{{dropdownStyleSelection}}</span> <i class="fa fa-chevron-down fa-fw opacity-50 ms-1"></i></button>
					<div class="dropdown-menu dropdown-menu-end rounded-3">
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Style')">None</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Realistic')">Realistic</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Anime')">Anime</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Cyberpunk')">Cyberpunk</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Pixel Art')">Pixel Art</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Cartoon')">Cartoon</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Sketch')">Sketch</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Fantasy')">Fantasy</a>
						<a class="dropdown-item" href="#" @click="selectDropdownStyleItem('Neon')">Neon</a>
					</div>
				</div>
			</div>
			<!-- END ai-option -->
			
			<hr />
			
			<!-- BEGIN ai-gen-tools -->
			<div class="fs-12px fw-bold mb-3">IMAGE GENERATION TOOLS</div>
			<div class="row g-3 g-lg-4">
				<div class="col-sm-6 col-xl-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div data-bs-theme="dark">
							<img class="card-img object-fit-cover rounded-0" height="160" src="/assets/img/ai/tools-1.jpg" alt="" />
							<div class="card-img-overlay p-2 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div>
									<Icon icon="solar:volleyball-2-bold-duotone" class="fs-26px text-body d-block mb-1"></Icon>
									<div class="fw-bold text-body fs-13px">Text to Image</div>
									<div class="fw-500 fs-11px lh-14 text-body text-opacity-60">Turn your words into stunning visuals with AI-generated artwork.</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<div class="col-sm-6 col-xl-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div data-bs-theme="dark">
							<img class="card-img object-fit-cover" height="160" src="/assets/img/ai/tools-2.jpg" alt="" />
							<div class="card-img-overlay p-2 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div>
									<Icon icon="solar:layers-minimalistic-bold-duotone" class="fs-26px text-body d-block mb-1"></Icon>
									<div class="fw-bold text-body fs-13px">Text to PNG</div>
									<div class="fw-500 fs-11px lh-14 text-body text-opacity-60">Create high-quality PNG images from text with transparency support.</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<div class="col-sm-6 col-xl-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div data-bs-theme="dark">
							<img class="card-img object-fit-cover" height="160" src="/assets/img/ai/tools-3.jpg" alt="" />
							<div class="card-img-overlay p-2 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div>
									<Icon icon="solar:gallery-edit-bold-duotone" class="fs-26px text-body d-block mb-1"></Icon>
									<div class="fw-bold text-body fs-13px">Image Editor</div>
									<div class="fw-500 fs-11px lh-14 text-body text-opacity-60">Enhance, modify, and perfect your images with powerful editing tools.</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<div class="col-sm-6 col-xl-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div data-bs-theme="dark">
							<img class="card-img object-fit-cover" height="160" src="/assets/img/ai/tools-4.jpg" alt="" />
							<div class="card-img-overlay p-2 d-flex align-items-end bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div>
									<Icon icon="solar:refresh-bold-duotone" class="fs-26px text-body d-block mb-1"></Icon>
									<div class="fw-bold text-body fs-13px">Reimagine</div>
									<div class="fw-500 fs-11px lh-14 text-body text-opacity-60">Transform and regenerate images with fresh, AI-powered creativity.</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
			</div>
			<!-- END ai-gen-tools -->
		</div>
		<!-- END ai-content -->
	</Card>
	<!-- END ai-generator -->
	
	<!-- BEGIN ai-generated-result -->
	<div id="aiGeneratedContainer" ref="aiGeneratedContainer" v-show="aiGenerating || aiGenerated" class="mb-4 pt-2">
		<div id="aiGeneratingResult" v-show="aiGenerating">
			<h4 class="mb-2">Generating</h4>
			<div class="mb-3 fw-bold d-flex align-items-center">
				<Icon icon="solar:info-circle-bold-duotone" class="fs-4"></Icon>
				<div class="ps-1">
					This is a simulated AI-generated response. Please note that the image was not created by an actual AI model.
				</div>
			</div>
			<!-- BEGIN row -->
			<div class="row g-3 g-lg-4">
				<!-- BEGIN col-6 -->
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div class="ratio" style="--bs-aspect-ratio: 68.46%;">
							<div><div class="shimmer-loader h-100"></div></div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<!-- END col-6 -->
				<!-- BEGIN col-6 -->
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div class="ratio" style="--bs-aspect-ratio: 68.46%;">
							<div><div class="shimmer-loader h-100"></div></div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<!-- END col-6 -->
				<!-- BEGIN col-6 -->
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div class="ratio" style="--bs-aspect-ratio: 68.46%;">
							<div><div class="shimmer-loader h-100"></div></div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<!-- END col-6 -->
				<!-- BEGIN col-6 -->
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="p-2">
						<div class="ratio" style="--bs-aspect-ratio: 68.46%;">
							<div><div class="shimmer-loader h-100"></div></div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<!-- END col-6 -->
			</div>
			<!-- END row -->
		</div>
		<div id="aiGeneratedResult" v-show="aiGenerated">
			<h4 class="mb-2">AI-Generated Result</h4>
			<div class="mb-3 fw-bold d-flex align-items-center">
				<Icon icon="solar:info-circle-bold-duotone" class="fs-4"></Icon>
				<div class="ps-1">
					This is a simulated AI-generated response. Please note that the image was not created by an actual AI model.
				</div>
			</div>
			<div class="row g-3 g-lg-4">
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="hover-show p-2" data-bs-theme="dark">
						<div>
							<img src="/assets/img/ai/generated-1.jpg" class="card-img rounded-0" alt="Generated Image" />
							<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div class="h-100 d-flex align-items-end">
									<div class="w-100">
										<div class="text-body text-truncate fs-13px fw-bold">Variant 1</div>
										<div class="d-flex fs-11px fw-500">
											<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
											<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="hover-show p-2" data-bs-theme="dark">
						<div>
							<img src="/assets/img/ai/generated-2.jpg" class="card-img rounded-0" alt="Generated Image" />
							<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div class="h-100 d-flex align-items-end">
									<div class="w-100">
										<div class="text-body text-truncate fs-13px fw-bold">Variant 2</div>
										<div class="d-flex fs-11px fw-500">
											<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
											<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="hover-show p-2" data-bs-theme="dark">
						<div>
							<img src="/assets/img/ai/generated-3.jpg" class="card-img rounded-0" alt="Generated Image" />
							<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div class="h-100 d-flex align-items-end">
									<div class="w-100">
										<div class="text-body text-truncate fs-13px fw-bold">Variant 3</div>
										<div class="d-flex fs-11px fw-500">
											<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
											<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
				<div class="col-sm-6 col-lg-3">
					<!-- BEGIN card -->
					<Card class="hover-show p-2" data-bs-theme="dark">
						<div>
							<img src="/assets/img/ai/generated-4.jpg" class="card-img rounded-0" alt="Generated Image" />
							<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
								<div class="h-100 d-flex align-items-end">
									<div class="w-100">
										<div class="text-body text-truncate fs-13px fw-bold">Variant 4</div>
										<div class="d-flex fs-11px fw-500">
											<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
											<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>
					<!-- END card -->
				</div>
			</div>
		</div>
	</div>
	<!-- END ai-generated-result -->
	
	<!-- BEGIN ai-imagine -->
	<div class="mb-4 pt-2">
		<h6 class="mb-3">EXPLORE IMAGINE</h6>
		<ul class="nav nav-pills mb-3 d-flex gap-1 fw-bold fs-11px text-uppercase">
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body bg-light" aria-current="page" href="#">All</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Fantasy</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Art</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Nature</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Popculture</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Futuristic</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Architecture</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Animals</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">People</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Food</a></li>
			<li class="nav-item"><a class="nav-link rounded-5 px-4 py-7px hover-bg-light bg-opacity-50 text-body" href="#">Horror</a></li>
		</ul>
		<div class="row g-4" data-masonry='{"percentPosition": true }' data-bs-theme="dark">
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-1.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Psychedelic girl illustration</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-2.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Fantasy water character</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-3.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Anime character using virtual reality glasses in the metaverse</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-4.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Fantasy water character</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-5.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Space adventure artwork</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-6.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Futuristic half-robot tiger in nature</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-7.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Psychedelic girl illustration</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-8.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">View of airplane flying through a fantasy world</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-9.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Fantasy style clouds with animal</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-10.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Psychedelic girl illustration</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-11.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Fantasy bird illustration</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-12.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Vibrant colored autumn trees on fiery backdrop generated by AI</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-13.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">View of rhinoceros animal with futuristic robotic parts</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-14.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Robot and human silhouettes</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-15.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Neon hologram of tiger</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-16.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Fantasy house on the moon illustration</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-17.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">People hanging out with robot</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-18.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Off-road car in fantasy scenario</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-19.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Cyberpunk city street at night with neon lights and futuristic aesthetic</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-20.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Cartoon ai robot scene</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-21.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Blockchain technology cartoon illustration</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-22.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Cartoon ai robot scene</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
			<div class="col-sm-6 col-md-3">
				<!-- BEGIN card -->
				<Card class="hover-show p-2">
					<div>
						<img src="/assets/img/ai/imagine-23.jpg" class="card-img rounded-0" alt="Generated Image" />
						<div class="card-img-overlay p-2 d-none hover-show-elm h-100 bg-gradient-to-t bg-gradient-from-black bg-gradient-to-transparent">
							<div class="h-100 d-flex align-items-end">
								<div class="w-100">
									<h5 class="card-title mb-0 lh-base text-truncate fs-13px text-body">Cartoon ai robot scene</h5>
									<div class="d-flex fs-11px fw-500">
										<a href="#" class="text-decoration-none text-body text-opacity-60 me-3"><i class="fa fa-fw fa-pen opacity-75"></i> Edit</a>
										<a href="#" class="text-decoration-none text-body text-opacity-60"><i class="fa fa-fw fa-repeat opacity-75"></i> Variation</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
				<!-- END card -->
			</div>
		</div>
	</div>
	<!-- END ai-imagine -->
</template>