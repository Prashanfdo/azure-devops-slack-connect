import { Block, ChatPostMessageArguments, KnownBlock } from "@slack/web-api";
import { GetSlackUser, GetSlackUserImageUrl, GetSlackUserName } from "../slack-helper";

interface CommentResource {
    "author": {
        "displayName": string;
        "url": string;
        "id": string;
        "uniqueName": string;
        "imageUrl": string;
    },
    "content": string;
    "_links": {
        "self": {
            "href": string;
        }
    }
}

interface PullRequestResource {
    "url": string;
    "title": string;
    "pullRequestId": string;
    "createdBy": {
        "displayName": string;
        "uniqueName": string;
    },
}

interface HookMessage {
    eventType: string;
    resource: {
        comment?: CommentResource,
        pullRequest?: PullRequestResource
    }
}

function pullRequests() {
    return [
        matchEvent('ms.vss-code.git-pullrequest-comment-event'),
        async (data: HookMessage) => codeReviewMessage([
            {
                "type": "divider"
            },
            {
                "type": 'section',
                "text": {
                    "type": "mrkdwn",
                    "text": `${data.resource.comment?.author.displayName} has <${pullRequestUrl(data.resource.pullRequest?.pullRequestId)}|commented> on ${data.resource.pullRequest?.createdBy.displayName}'s <${pullRequestUrl(data.resource.pullRequest?.pullRequestId)}|pull request>\n\`${data.resource.comment?.content}\``
                },
                "accessory": {
                    "type": "image",
                    "image_url": await GetSlackUserImageUrl(data.resource.pullRequest?.createdBy.uniqueName),
                    "alt_text": data.resource.pullRequest?.createdBy.displayName
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View Comment",
                            "emoji": true
                        },
                        "url": pullRequestUrl(data.resource.pullRequest?.pullRequestId)
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View PR",
                            "emoji": true
                        },
                        "url": pullRequestUrl(data.resource.pullRequest?.pullRequestId)
                    },
                ]
            }
        ], {
            username: 'PR Commented'
        })
    ];
}

export default [
    pullRequests(),
];

function codeReviewMessage(blocks: (Block | KnownBlock)[], options?: Partial<ChatPostMessageArguments>): ChatPostMessageArguments {
    return {
        channel: 'pull-requests',
        username: 'DevOps',
        blocks,
        ...options
    }
}

function matchEvent(eventType: string) {
    return (hookData: any) => hookData?.eventType === eventType;
}

function commentUrl() {

}
function pullRequestUrl(prId?: string) {
    return `https://dev.azure.com/labfriend/Labfriend/_git/LabFriendCore/pullrequest/${prId}`;
}