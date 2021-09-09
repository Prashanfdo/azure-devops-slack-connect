import transformAzureDevopsEvents from './hook-transformers/azure-devops-events';
const transformers: any[] = [];

transformers.push(...transformAzureDevopsEvents);

export async function GetSlackMessages(postData: any) {
    const matches = transformers.filter(([testFn]) => testFn?.(postData)).map(([, transformMessage]) => transformMessage);
    return await Promise.all(matches.map(async transformMessage => await transformMessage(postData)));
}