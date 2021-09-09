import { Block, ChatPostMessageArguments, KnownBlock } from "@slack/web-api";
import { GetSlackUser, GetSlackUserName } from "../slack-helper";

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
                    "text": `${await GetSlackUserName(data.resource.comment?.author.uniqueName)} has commented on Tharindu's pullrequest`
                }
            }
        ])
    ];
}

export default [
    pullRequests(),
];

function codeReviewMessage(blocks: (Block | KnownBlock)[]): ChatPostMessageArguments {
    return {
        channel: 'appservicescaling',
        blocks,
    }
}

function matchEvent(eventType: string) {
    return (hookData: any) => hookData?.eventType === eventType;
}

