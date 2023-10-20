<?php

class ReviewersListPanel extends \PKP\components\listPanels\PKPSelectReviewerListPanel
{
    public function getConfig()
    {
        $config = parent::getConfig();
        $config = array_merge(
            $config,
            [
                'reviewerHistoryLabel' => __('plugins.generic.reviewersDetails.viewHistory'),
                'reviewsHistoryLabel' => __('plugins.generic.reviewersDetails.reviewsHistory'),
                'reviewsLabel' => __('plugins.generic.reviewersDetails.reviews'),
            ]
        );

        return $config;
    }
}
