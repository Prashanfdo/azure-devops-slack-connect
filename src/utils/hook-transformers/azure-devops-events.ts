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
                    "text": `${data.resource.comment?.author.displayName} has <${data.resource.comment?._links.self.href}|commented> on ${data.resource.pullRequest?.createdBy.displayName}'s <${data.resource.pullRequest?.url}|pullrequest>\n\`${data.resource.comment?.content}\``
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
                        "url": data.resource.comment?._links.self.href
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View PR",
                            "emoji": true
                        },
                        "url": data.resource.pullRequest?.url
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
        channel: 'appservicescaling',
        username: 'DevOps',
        blocks,
        ...options
    }
}

function matchEvent(eventType: string) {
    return (hookData: any) => hookData?.eventType === eventType;
}

