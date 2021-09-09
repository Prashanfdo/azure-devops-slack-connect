import { Block, ChatPostMessageArguments, KnownBlock, WebClient } from '@slack/web-api';
import moment from 'moment';
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

export async function PostToSlack(mesageArgs: ChatPostMessageArguments) {
    // console.log(111111, await web.users.list()); 
    await web.chat.postMessage({
        ...mesageArgs
    });
}

let users: any = null;
let usersLastUpdated: any = null;
export async function GetSlackUser(email: any) {
    const emailUserMap: any = process.env.USERS_MAP?.split(',')?.reduce((acc, user) => {
        const [slackName, email] = user.split('=');
        return {
            ...acc,
            [email]: slackName
        }
    }, {});

    const slackName = emailUserMap[email];

    if (!slackName) {
        return;
    }

    if (!users || !usersLastUpdated || moment(usersLastUpdated).add(1, 'hours').isBefore(moment())) {
        usersLastUpdated = moment().toDate();
        users = (await web.users.list())?.members || [];
    }
    return users.find(({ name }: any) => name === slackName)?.profile;
}

export async function GetSlackUserName(email: any) {
    return (await GetSlackUser(email))?.display_name_normalized;
}