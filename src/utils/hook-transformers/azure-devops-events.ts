import { Block, ChatPostMessageArguments, KnownBlock } from "@slack/web-api";

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
        (data: HookMessage) => codeReviewMessage([
            {
                "type": 'section',
                "text": {
                    "type": "mrkdwn",
                    "text": `${data.resource.comment?.author.displayName} has edited a pull request comment\r\nThis is my comment.\r\n ${data.resource.comment?.author.imageUrl} ${data.resource.comment?.author.uniqueName}`
                }
            }
        ])
    ];
}

export default [
    pullRequests(),
];

function codeReviewMessage(blocks: (Block | KnownBlock)[]): ChatPostMessageArguments {
    console.log(blocks);
    return {
        channel: 'appservicescaling',
        blocks,
    }
}

function matchEvent(eventType: string) {
    return (hookData: any) => hookData?.eventType === eventType;
}

