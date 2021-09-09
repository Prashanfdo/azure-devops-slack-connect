import transformAzureDevopsEvents from './hook-transformers/azure-devops-events';
const transformers: any[] = [];

transformers.push(...transformAzureDevopsEvents);

export async function GetSlackMessages(postData: any) {
    const matches = transformers.filter(([testFn]) => testFn?.(postData)).map(([, transformMessage]) => transformMessage);

    return Promise.all(matches.map(transformMessage => transformMessage(postData)));
}