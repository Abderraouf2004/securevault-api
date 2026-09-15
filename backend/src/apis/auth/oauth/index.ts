import { Router } from "express";
import * as oidc from "openid-client";
import { getGoogleConfig } from "../../../modules/auth/oauth/google.config";
import jwt from "jsonwebtoken";
import { prisma } from "../../../services/prisma";

const googleRouter = Router();

googleRouter.get("/google", async (req, res, next) => {
  try {
    const config = await getGoogleConfig();

    const codeVerifier = oidc.randomPKCECodeVerifier();

    const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

    const state = oidc.randomState();

    req.session.oauth = {
      state,
      codeVerifier,
    };
    console.log("OAuth session created:", req.sessionID);

    const authorizationUrl = oidc.buildAuthorizationUrl(config, {
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
    });

    // res.redirect(authorizationUrl.href);
    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(authorizationUrl.href);
    });
  } catch (error) {
    next(error);
  }
});

googleRouter.get("/google/callback", async (req, res, next) => {
  try {
    const config = await getGoogleConfig();

    const frontendUrl = process.env.FRONTEND_URL;
    const failure = (reason: string) => {
      const url = new URL("/app/login", frontendUrl);
      url.searchParams.set("oauthError", reason);
      return res.redirect(url.toString());
    };
    console.log("OAuth callback session:", req.sessionID);
    console.log("OAuth session data:", req.session.oauth);
    const oauth = req.session.oauth;

    if (!oauth) {
      return failure("session_expired");
    }

    const currentUrl = new URL(
      `${process.env.GOOGLE_REDIRECT_URI}?${new URLSearchParams(
        req.query as Record<string, string>,
      ).toString()}`,
    );

    const tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: oauth.codeVerifier,
      expectedState: oauth.state,
    });

    delete req.session.oauth;

    const claims = tokens.claims();

    if (!claims) {
      return failure("no_claims");
    }

    const googleId = claims.sub as string;
    const email = claims.email as string;
    const name = claims.name as string;
    const picture = claims.picture as string;

    if (!googleId || !email) {
      return failure("incomplete_account");
    }

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          googleId,
          avatar: picture ?? user.avatar,
          name: name ?? user.name,
        },
      });
    }

    if (!user) {
      const role = await prisma.role.findUnique({
        where: {
          name: "USER",
        },
      });

      if (!role) {
        return failure("role_missing");
      }

      user = await prisma.user.create({
        data: {
          name: name ?? "Google User",
          email,
          password: null,
          googleId,
          avatar: picture ?? null,
          roleId: role.id,
        },
      });
    }

    const payload = {
      id: user.id,
      roleId: user.roleId,
    };

    // Matches the lifetimes /auth/signin issues, so a Google session can
    // silently refresh the same way a password session does.
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const redirectUrl = new URL("/oauth/callback", frontendUrl);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    next(error);
  }
});
export default googleRouter;
