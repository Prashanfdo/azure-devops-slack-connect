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
}

interface HookMessage {
    eventType: string;
    resource: {
        comment?: CommentResource,
    }
}

function pullRequests() {
    return [
        matchEvent('ms.vss-code.git-pullrequest-comment-event'),
        async (data: HookMessage) => codeReviewMessage([
            {
                "type": 'section',
                "text": {
                    "type": "mrkdwn",
                    "text": `${data.resource.comment?.author.displayName} has commented on Tharindu's pullrequest`
                }
            }
        ], {
            username: data.resource.comment?.author.displayName,
            icon_url: await GetSlackUserImageUrl(data.resource.comment?.author.uniqueName),
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

