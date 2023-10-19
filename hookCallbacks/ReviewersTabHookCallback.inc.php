<?php

class ReviewersTabHookCallback
{
    private $plugin;

    public function __construct($plugin)
    {
        $this->plugin = $plugin;

        HookRegistry::register('Template::Settings::access', [$this, 'addReviewersTab']);
        HookRegistry::register('TemplateManager::display', [$this, 'setupReviewersListPanel']);
    }

    public function addReviewersTab($hookName, $args)
    {
        $templateMgr = $args[1];
        $output = &$args[2];
        $output .= $templateMgr->fetch($this->plugin->getTemplateResource('reviewersTab.tpl'));
        return false;
    }

    public function setupReviewersListPanel($hookName, $args)
    {
        $templateMgr = $args[0];
        $template = $args[1];
        $request = Application::get()->getRequest();
        $context = $request->getContext();

        if ($template != 'management/access.tpl') {
            return false;
        }

        $pluginFullPath = $request->getBaseUrl() . DIRECTORY_SEPARATOR . $this->plugin->getPluginPath();

        $templateMgr->addJavaScript(
            'reviewers-list-item',
            $pluginFullPath . '/js/components/ReviewersListItem.js',
            [
                'priority' => STYLE_SEQUENCE_LAST,
                'contexts' => ['backend']
            ]
        );

        $templateMgr->addJavaScript(
            'reviewers-list-panel',
            $pluginFullPath . '/js/components/ReviewersListPanel.js',
            [
                'priority' => STYLE_SEQUENCE_LAST,
                'contexts' => ['backend']
            ]
        );

        AppLocale::requireComponents(LOCALE_COMPONENT_PKP_EDITOR);

        $reviewerListPanel = new \PKP\components\listPanels\PKPSelectReviewerListPanel(
            'reviewers',
            __('user.role.reviewers'),
            [
                'apiUrl' => $request->getDispatcher()->url(
                    $request,
                    ROUTE_API,
                    $context->getPath(),
                    'users/reviewers'
                ),
                'getParams' => [
                    'contextId' => $context->getId(),
                ],
                'selectorName' => 'reviewerId',
            ]
        );
        $reviewerListPanel->set([
            'items' => $reviewerListPanel->getItems($request),
            'itemsMax' => $reviewerListPanel->getItemsMax(),
        ]);

        $components = $templateMgr->getState('components');
        $components['reviewers'] = $reviewerListPanel->getConfig();
        $templateMgr->setState(['components' => $components]);

        return false;
    }
}
