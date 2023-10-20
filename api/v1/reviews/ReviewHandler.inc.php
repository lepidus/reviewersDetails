<?php

import('lib.pkp.classes.handler.APIHandler');
import('classes.core.Services');

class ReviewHandler extends APIHandler
{
    public function __construct()
    {
        $this->_handlerPath = 'reviews';
        $roles = [ROLE_ID_SITE_ADMIN, ROLE_ID_MANAGER, ROLE_ID_SUB_EDITOR];
        $this->_endpoints = [
            'GET' => [
                [
                    'pattern' => $this->getEndpointPattern(),
                    'handler' => [$this, 'getMany'],
                    'roles' => $roles
                ],
            ],
        ];
        parent::__construct();
    }

    public function authorize($request, &$args, $roleAssignments)
    {
        import('lib.pkp.classes.security.authorization.ContextAccessPolicy');
        $this->addPolicy(new ContextAccessPolicy($request, $roleAssignments));
        return parent::authorize($request, $args, $roleAssignments);
    }

    public function getMany($slimRequest, $response, $args)
    {
        $request = $this->getRequest();
        $queryParams = $slimRequest->getQueryParams();

        $reviewAssignmentDAO = DAORegistry::getDAO('ReviewAssignmentDAO');
        $reviewAssignments = $reviewAssignmentDAO->getByUserId($queryParams['reviewerId']);

        $items = [];
        foreach ($reviewAssignments as $reviewAssignment) {
            $getPropertiesArgs = [
                'request' => $request,
                'slimRequest' => $slimRequest,
            ];
            $submission = Services::get('submission')->get($reviewAssignment->getSubmissionId());
            $reviewProps = \Services::get('submission')->getProperties(
                $submission,
                [
                    'id',
                    'urlWorkflow',
                ],
                $getPropertiesArgs
            );
            $reviewProps = array_merge(
                $reviewProps,
                \Services::get('publication')->getProperties(
                    $submission->getCurrentPublication(),
                    [
                        'authorsStringShort',
                        'fullTitle',
                    ],
                    $getPropertiesArgs
                )
            );
            $reviewProps['status'] = $this->getReviewStatusLabel($reviewAssignment);
            $items[] = $reviewProps;
        }

        return $response->withJson([
            'items' => $items
        ], 200);
    }

    private function getReviewStatusLabel($reviewAssignment)
    {
        if ($reviewAssignment->getDeclined()) {
            return __('plugins.generic.reviewersDetails.review.declined');
        }
        if ($reviewAssignment->getCancelled()) {
            return __('plugins.generic.reviewersDetails.review.cancelled');
        }

        if (!$reviewAssignment->getDateCompleted()) {
            return __('plugins.generic.reviewersDetails.review.incomplete');
        }

        return __('plugins.generic.reviewersDetails.review.completed');
    }
}
