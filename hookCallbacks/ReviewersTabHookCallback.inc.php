<?php

class ReviewersTabHookCallback
{
    private $plugin;

    public function __construct($plugin)
    {
        $this->plugin = $plugin;

        HookRegistry::register('Template::Settings::access', [$this, 'addReviewersTab']);
    }

    public function addReviewersTab($hookName, $args)
    {
        $templateMgr = $args[1];
        $output = &$args[2];
        $output .= $templateMgr->fetch($this->plugin->getTemplateResource('reviewersTab.tpl'));
        return false;
    }
}
