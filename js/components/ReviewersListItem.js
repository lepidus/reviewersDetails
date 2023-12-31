let listItemTemplate = pkp.Vue.compile(`
    <div class="listPanel__item--reviewer">
        <div class="listPanel__itemSummary">
            <div class="listPanel__itemIdentity">
                <div class="listPanel__itemTitle">
                    <badge
                        v-if="item.reviewsActive"
                        class="listPanel__item--reviewer__active"
                    >
                        {{
                            activeReviewsCountLabel.replace('{$count}', item.reviewsActive)
                        }}
					</badge>
                    {{ item.fullName }}
                    <span
                        v-if="item.reviewerRating !== null"
                        class="listPanel__item--reviewer__rating"
                    >
                        <icon
                            v-for="(star, index) in stars"
                            :key="index"
                            icon="star"
                            :class="
                                star
                                    ? 'listPanel__item--reviewer__star--on'
                                    : 'listPanel__item--reviewer__star--off'
                            "
                        />
                        <span class="-screenReader">
                            {{
                                reviewerRatingLabel.replace('{$rating}', item.reviewerRating)
                            }}
                        </span>
                    </span>
                </div>

                <div class="listPanel__itemSubtitle">
                    <div
                        v-if="item.affiliation || item.orcid || item.email"
                        class="listPanel__item--reviewer__info"
                    >
                        <span class="listPanel__item--reviewer__affiliation">
                            {{ localize(item.affiliation) }}
                        </span>
                        <span class="listPanel__item--reviewer__email">
                            {{ item.email }}
                        </span>
                        <a
                            v-if="item.orcid"
                            :href="item.orcid"
                            class="listPanel__item--reviewer__orcid"
                            target="_blank"
                        >
                            <icon icon="orcid" :inline="true" />
                            {{ item.orcid }}
                        </a>
                    </div>
                </div>

                <!-- use aria-hidden on these details because the information can be
                    more easily acquired by screen readers from the details panel. -->
                <div
                    class="listPanel__item--reviewer__brief"
                    aria-hidden="true"
                >
                    <span class="listPanel__item--reviewer__complete">
                        <icon icon="check-circle-o" :inline="true" />
                        {{ item.reviewsCompleted }}
                    </span>
                    <span class="listPanel__item--reviewer__last">
                        <icon icon="history" :inline="true" />
                        {{ daysSinceLastAssignmentLabelCompiled }}
                    </span>
                    <span
                        v-if="item.interests.length"
                        class="listPanel__item--reviewer__interests"
                    >
                        <icon icon="book" :inline="true" />
                        {{ interestsString }}
                    </span>
                </div>
            </div>

            <div class="listPanel__itemActions">
                <pkp-button @click="showHistory">
                    <span aria-hidden="true">{{ reviewerHistoryLabel }}</span>
                    <span class="-screenReader">
                        {{ __('common.selectWithName', {name: item.fullName}) }}
                    </span>
				</pkp-button>
                <expander
                    :isExpanded="isExpanded"
                    :itemName="item.fullName"
                    @toggle="isExpanded = !isExpanded"
                />
            </div>
        </div>
        <div
            v-if="isExpanded"
            class="listPanel__itemExpanded listPanel__itemExpanded--reviewer"
        >
            <list>
                <list-item>
                    <template slot="value">
                        <icon icon="clock-o" :inline="true" />
                        {{ item.reviewsActive }}
                    </template>
                    {{ activeReviewsLabel }}
                </list-item>
                <list-item>
                    <template slot="value">
                        <icon icon="check-circle-o" :inline="true" />
                        {{ item.reviewsCompleted }}
                    </template>
                    {{ completedReviewsLabel }}
                </list-item>
                <list-item>
                    <template slot="value">
                        <icon icon="times-circle-o" :inline="true" />
                        {{ item.reviewsDeclined }}
                    </template>
                    {{ declinedReviewsLabel }}
                </list-item>
                <list-item>
                    <template slot="value">
                        <icon icon="ban" :inline="true" />
                        {{ item.reviewsCancelled }}
                    </template>
                    {{ cancelledReviewsLabel }}
                </list-item>
                <list-item>
                    <template slot="value">
                        <icon icon="history" :inline="true" />
                        {{ daysSinceLastAssignment }}
                    </template>
                    {{ daysSinceLastAssignmentDescriptionLabel }}
                </list-item>
                <list-item>
                    <template slot="value">
                        <icon icon="calendar" :inline="true" />
                        {{ item.averageReviewCompletionDays }}
                    </template>
                    {{ averageCompletionLabel }}
                </list-item>
                <list-item v-if="item.interests.length">
                    <div class="listPanel__item--reviewer__detailHeading">
                        <icon icon="book" :inline="true" />
                        {{ reviewInterestsLabel }}
                    </div>
                    {{ interestsString }}
                </list-item>
                <list-item v-if="item.gossip">
                    <div class="listPanel__item--reviewer__detailHeading">
                        {{ gossipLabel }}
                    </div>
                    <div v-html="item.gossip"></div>
                </list-item>
                <list-item v-if="localize(item.biography)">
                    <div class="listPanel__item--reviewer__detailHeading">
                        {{ biographyLabel }}
                    </div>
                    <div v-html="localize(item.biography)"></div>
                </list-item>
            </list>
        </div>
    </div>
`);

pkp.Vue.component('reviewers-list-item', {
	name: 'ReviewersListItem',
	extends: pkp.controllers.Container.components.SelectReviewerListPanel.components.SelectReviewerListItem,
    props: {
        reviewerHistoryLabel: {
			type: String,
			required: true
		},
    },
    methods: {
		showHistory() {
			this.$emit('show-history', this.item);
		},
	},
    render: function (h) {
        return listItemTemplate.render.call(this, h);
    },
});