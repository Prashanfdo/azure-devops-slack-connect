import { Block, ChatPostMessageArguments, KnownBlock, WebClient } from '@slack/web-api';
import moment from 'moment';
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

export async function PostToSlack(mesageArgs: ChatPostMessageArguments) {
    await web.chat.postMessage({
        text: '',
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

    console.log(666666, slackName);
    if (!slackName) {
        console.log(222222);
        return;
    }

    if (!users || !usersLastUpdated || moment(usersLastUpdated).add(15, 'minutes').isBefore(moment())) {
        usersLastUpdated = moment().toDate();
        users = (await web.users.list())?.members || [];
    }
    const matchedUser = users.find(({ name }: any) => name === slackName);
    return matchedUser?.profile;
}

export async function GetSlackUserName(email: any) {
    return (await GetSlackUser(email))?.display_name_normalized;
}