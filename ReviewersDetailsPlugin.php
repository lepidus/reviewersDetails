<?php

import('lib.pkp.classes.plugins.GenericPlugin');

class ReviewersDetailsPlugin extends GenericPlugin
{
    public function register($category, $path, $mainContextId = null)
    {

        $success = parent::register($category, $path);

        if ($success && $this->getEnabled()) {
        }

        return $success;
    }

    public function getDisplayName()
    {
        return '';
    }

    public function getDescription()
    {
        return '';
    }
}
