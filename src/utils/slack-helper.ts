import { Block, ChatPostMessageArguments, KnownBlock, WebClient } from '@slack/web-api';
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

export async function PostToSlack(mesageArgs: ChatPostMessageArguments) {
    await web.chat.postMessage({
        ...mesageArgs
    });
}
