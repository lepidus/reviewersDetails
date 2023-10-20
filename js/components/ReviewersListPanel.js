let listPanelTemplate = pkp.Vue.compile(`
    <div>
		<slot>
			<list-panel
				class="listPanel--selectReviewer"
				:isSidebarVisible="isSidebarVisible"
				:items="items"
			>
				<pkp-header slot="header">
					<h2>
						{{ title }}
					</h2>
					<spinner v-if="isLoading" />
					<template slot="actions">
						<search
							:searchPhrase="searchPhrase"
							@search-phrase-changed="setSearchPhrase"
						/>
						<pkp-button
							:isActive="isSidebarVisible"
							@click="isSidebarVisible = !isSidebarVisible"
						>
							<icon icon="filter" :inline="true" />
							{{ __('common.filter') }}
						</pkp-button>
					</template>
				</pkp-header>

				<template slot="sidebar">
					<pkp-header :isOneLine="false">
						<h2>
							<icon icon="filter" :inline="true" />
							{{ __('common.filter') }}
						</h2>
					</pkp-header>
					<component
						v-for="filter in filters"
						:key="filter.param"
						:is="filter.filterType || 'filter-slider'"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@update-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</template>

				<template v-if="isLoading" slot="itemsEmpty">
					<template v-if="isLoading">
						<spinner />
						{{ __('common.loading') }}
					</template>
					<template v-else>
						{{ emptyLabel }}
					</template>
				</template>

				<template v-slot:item="{item}">
					<reviewers-list-item
						:activeReviewsCountLabel="activeReviewsCountLabel"
						:activeReviewsLabel="activeReviewsLabel"
						:averageCompletionLabel="averageCompletionLabel"
						:biographyLabel="biographyLabel"
						:cancelledReviewsLabel="cancelledReviewsLabel"
						:completedReviewsLabel="completedReviewsLabel"
						:daySinceLastAssignmentLabel="daySinceLastAssignmentLabel"
						:daysSinceLastAssignmentLabel="daysSinceLastAssignmentLabel"
						:daysSinceLastAssignmentDescriptionLabel="
							daysSinceLastAssignmentDescriptionLabel
						"
						:declinedReviewsLabel="declinedReviewsLabel"
						:gossipLabel="gossipLabel"
						:key="item.id"
						:item="item"
						:neverAssignedLabel="neverAssignedLabel"
						:reviewerRatingLabel="reviewerRatingLabel"
						:reviewInterestsLabel="reviewInterestsLabel"
						:reviewerHistoryLabel="reviewerHistoryLabel"
						:selectorName="selectorName"
						@show-history="showHistory"
					/>
				</template>

				<template slot="footer">
					<pagination
						v-if="lastPage > 1"
						:currentPage="currentPage"
						:isLoading="isLoading"
						:lastPage="lastPage"
						@set-page="setPage"
					/>
				</template>
			</list-panel>
			<modal v-bind="MODAL_PROPS" name="reviewsHistory">
				<modal-content
					:closeLabel="__('common.close')"
					modalName="reviewsHistory"
					:title="reviewsHistoryLabel"
				>
					<list-panel
						:title="reviewsLabel"
						:items="reviews"
						class="reviewsListPanel"
					>
						<template v-slot:itemTitle="{item}">
							<div class="listPanel__item--submission__id">
								{{ item.id }}
							</div>
							{{ item.authorsStringShort }}
						</template>
						<template v-slot:itemSubtitle="{item}">
							{{ localize(item.title) }}
						</template>
						<template v-slot:itemActions="{item}">
							<badge
								class="listPanel__itemStatus"
							>
								{{ item.status }}
							</badge>
							<pkp-button element="a" :href="item.urlWorkflow">
								{{ __('common.view') }}
							</pkp-button>
						</template>
					</list-panel>
				</modal-content>
			</modal>
		</slot>
	</div>
`);

pkp.Vue.component('reviewers-list-panel', {
	name: 'ReviewersListPanel',
	extends: pkp.controllers.Container.components.SelectReviewerListPanel,
	props: {
        reviewerHistoryLabel: {
			type: String,
			required: true
		},
		reviewsHistoryLabel: {
			type: String,
			required: true
		},
		reviewsLabel: {
			type: String,
			required: true
		},
    },
	data() {
		return {
			reviews: []
		};
	},
	methods: {
		showHistory(item) {
			this.$modal.show('reviewsHistory');
		},
	},
    render: function (h) {
        return listPanelTemplate.render.call(this, h);
    },
});