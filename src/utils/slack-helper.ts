import { Block, ChatPostMessageArguments, KnownBlock, WebClient } from '@slack/web-api';
import moment from 'moment';
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

export async function PostToSlack(mesageArgs: ChatPostMessageArguments) {
    await web.chat.postMessage({
        text: '',
        ...mesageArgs,
    });
}

let users: any[] = [];
let usersLastUpdated: any = null;
export async function GetSlackUser(email: any) {
    if (!usersLastUpdated || moment(usersLastUpdated).add(15, 'minutes').isBefore(moment())) {
        usersLastUpdated = moment().toDate();
        users = (await web.users.list())?.members || [];

        users = users.reduce((acc, user) => {
            return {
                ...acc,
                [user.profile?.email]: user.profile
            };
        }, {});
    }
    const matchedUser = users[email];
    console.log(matchedUser?.image_48);
    return matchedUser;
}

export async function GetSlackUserName(email: any) {
    return (await GetSlackUser(email))?.display_name_normalized;
}

export async function GetSlackUserImageUrl(email: any) {
    return (await GetSlackUser(email))?.image_48;
}