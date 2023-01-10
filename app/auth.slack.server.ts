import {
  OAuth2Strategy,
  type OAuth2StrategyVerifyParams,
  type OAuth2Profile,
} from 'remix-auth-oauth2'
import type { StrategyVerifyCallback } from 'remix-auth'
import jwt_decode from 'jwt-decode'

export interface SlackStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
  scope?: SlackScope[] | string
}

export type SlackScope = 'openid' | 'profile' | 'email'

export interface SlackIdTokenPayload {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  auth_time: number
  nonce: string
  at_hash: string
  'https://slack.com/team_id': string
  'https://slack.com/user_id': string
  email: string
  email_verified: boolean
  date_email_verified: number
  locale: string
  name: string
  picture: string
  given_name: string
  family_name: string
  'https://slack.com/team_name': string
  'https://slack.com/team_domain': string
  'https://slack.com/team_image_230': string
  'https://slack.com/team_image_default': boolean
}
export interface SlackProfile extends OAuth2Profile {
  id: string
  _json: {
    teamId: SlackIdTokenPayload['https://slack.com/team_id']
    teamName: SlackIdTokenPayload['https://slack.com/team_name']
  }
}

export interface SlackExtraParams extends Record<string, string | number> {
  id_token: string
}

export const SlackStrategyDefaultScope: SlackScope[] = [
  'openid',
  'profile',
  'email',
]
export const SlackStrategyScopeSeparator = ' '

export class SlackStrategy<User> extends OAuth2Strategy<
  User,
  SlackProfile,
  SlackExtraParams
> {
  name = 'slack'

  private scope: SlackScope[]
  constructor(
    { clientID, clientSecret, callbackURL, scope }: SlackStrategyOptions,
    verify: StrategyVerifyCallback<
      User,
      OAuth2StrategyVerifyParams<SlackProfile, SlackExtraParams>
    >,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(
      {
        clientID,
        clientSecret,
        callbackURL,
        authorizationURL: 'https://slack.com/openid/connect/authorize',
        tokenURL: 'https://slack.com/api/openid.connect.token',
      },
      verify,
    )
    this.scope = this.getScope(scope)
  }

  private getScope(scope: SlackStrategyOptions['scope']) {
    if (!scope) {
      return SlackStrategyDefaultScope
    } else if (typeof scope === 'string') {
      return scope.split(SlackStrategyScopeSeparator) as SlackScope[]
    }
    return scope
  }

  protected authorizationParams() {
    return new URLSearchParams({
      scope: this.scope.join(SlackStrategyScopeSeparator),
    })
  }

  protected async getAccessToken(response: Response): Promise<{
    accessToken: string
    refreshToken: string
    extraParams: SlackExtraParams
  }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { access_token, refresh_token, ...extraParams } = res
    return {
      accessToken: access_token as string,
      refreshToken: refresh_token as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      extraParams,
    } as const
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async userProfile(
    accessToken: string,
    extraParams: SlackExtraParams,
  ): Promise<SlackProfile> {
    const payload: SlackIdTokenPayload = jwt_decode(extraParams.id_token)
    const profile: SlackProfile = {
      provider: 'slack',
      id: payload.sub,
      displayName: payload.name,
      name: {
        familyName: payload.family_name,
        givenName: payload.given_name,
        middleName: '',
      },
      emails: [{ value: payload.email }],
      photos: [{ value: payload.picture }],
      _json: {
        teamId: payload['https://slack.com/team_id'],
        teamName: payload['https://slack.com/team_name'],
      },
    }
    return profile
  }
}
