<?php

class ReviewersListPanel extends \PKP\components\listPanels\PKPSelectReviewerListPanel
{
    public function getConfig()
    {
        $config = parent::getConfig();

        $config['reviewerHistoryLabel'] = __('plugins.generic.reviewersDetails.viewHistory');
        $config['reviewsHistoryLabel'] = __('plugins.generic.reviewersDetails.reviewsHistory');

        return $config;
    }
}
