import { SlackStrategy } from '../../libs/SlackStrategy.server'
import invariant from 'tiny-invariant'
import { verifyUser } from './verify-user.server'

invariant(process.env.SLACK_CLIENT_ID, 'SLACK_CLIENT_ID is required')
invariant(process.env.SLACK_CLIENT_SECRET, 'SLACK_CLIENT_SECRET is required')

export const strategy = new SlackStrategy(
  {
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackURL: '/auth/slack/callback',
    team: process.env.SLACK_TEAM_ID,
  },
  verifyUser,
)
