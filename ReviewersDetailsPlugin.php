<?php

import('lib.pkp.classes.plugins.GenericPlugin');

class ReviewersDetailsPlugin extends GenericPlugin
{
    public function register($category, $path, $mainContextId = null)
    {
        $success = parent::register($category, $path);

        if ($success && $this->getEnabled()) {
            $this->initHookCallbacks();
        }

        return $success;
    }

    public function getDisplayName()
    {
        return __('plugins.generic.reviewersDetails.name');
    }

    public function getDescription()
    {
        return __('plugins.generic.reviewersDetails.description');
    }

    public function initHookCallbacks()
    {
        $this->import('hookCallbacks.ReviewersTabHookCallback');
        $hookCallback = new ReviewersTabHookCallback($this);
    }
}
