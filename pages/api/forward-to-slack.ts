// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import  { WebClient }  from '@slack/web-api';

type Data = {
  name: string
}

const slackToken = process.env.SLACK_TOKEN;

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ name: `John Doe ${slackToken}` })
}
