// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { GetSlackMessages } from 'src/utils/hook-transform';
import { PostToSlack } from 'src/utils/slack-helper';

type Data = {
  name: string
}

const slackToken = process.env.SLACK_TOKEN;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const messages = GetSlackMessages(req.body);
  await Promise.all(messages.map(PostToSlack));
  res.status(200).json({ messages })
}
