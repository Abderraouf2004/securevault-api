import { Router } from "express";
import * as oidc from "openid-client";
import  {getGoogleConfig}  from "../../../modules/auth/oauth/google.config";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    const authorizationUrl = oidc.buildAuthorizationUrl(config, {
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
    });



    res.redirect(authorizationUrl.href);
  } catch (error) {
    next(error);
  }
});




// googleRouter.get("/google/callback", async (req, res, next) => {
//   try {
//     const config = await getGoogleConfig();

//     const oauth = req.session.oauth;

//     if (!oauth) {
//       return res.status(400).json({
//         message: "OAuth session not found",
//       });
//     }

//     const currentUrl = new URL(
//       `${process.env.GOOGLE_REDIRECT_URI}?${new URLSearchParams(
//         req.query as Record<string, string>,
//       ).toString()}`,
//     );

//     const tokens = await oidc.authorizationCodeGrant(
//       config,
//       currentUrl,
//       {
//         pkceCodeVerifier: oauth.codeVerifier,
//         expectedState: oauth.state,
//       },
//     );

//     delete req.session.oauth;

//     const claims = tokens.claims();

//     if (!claims) {
//       return res.status(400).json({
//         message: "Google ID token claims not found",
//       });
//     }

//     console.log("Google user:", {
//       sub: claims.sub,
//       email: claims.email,
//       name: claims.name,
//       picture: claims.picture,
//     });

//     res.json({
//       message: "Google OAuth successful",
//       user: {
//         googleId: claims.sub,
//         email: claims.email,
//         name: claims.name,
//         picture: claims.picture,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });



googleRouter.get("/google/callback", async (req, res, next) => {
  try {
    const config = await getGoogleConfig();

    const oauth = req.session.oauth;

    if (!oauth) {
      return res.status(400).json({
        message: "OAuth session not found",
      });
    }

    const currentUrl = new URL(
      `${process.env.GOOGLE_REDIRECT_URI}?${new URLSearchParams(
        req.query as Record<string, string>,
      ).toString()}`,
    );

    // --------------------------------------------------------
    // Exchange authorization code for tokens
    // --------------------------------------------------------

    const tokens = await oidc.authorizationCodeGrant(
      config,
      currentUrl,
      {
        pkceCodeVerifier: oauth.codeVerifier,
        expectedState: oauth.state,
      },
    );

    // OAuth session no longer needed
    delete req.session.oauth;

    // --------------------------------------------------------
    // Get Google ID token claims
    // --------------------------------------------------------

    const claims = tokens.claims();

    if (!claims) {
      return res.status(400).json({
        message: "Google ID token claims not found",
      });
    }

    const googleId = claims.sub as string;
    const email = claims.email as string ;
    const name = claims.name as string;
    const picture = claims.picture as string;

    if (!googleId || !email) {
      return res.status(400).json({
        message: "Google account information is incomplete",
      });
    }

    // --------------------------------------------------------
    // Find existing local user
    // --------------------------------------------------------

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // --------------------------------------------------------
    // Existing user
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // New user
    // --------------------------------------------------------

    if (!user) {
      const role = await prisma.role.findUnique({
        where: {
          name: "USER",
        },
      });

      if (!role) {
        return res.status(500).json({
          message: "Default USER role not found",
        });
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

    // --------------------------------------------------------
    // Create JWT
    // --------------------------------------------------------

    const token = jwt.sign(
      {
        id: user.id,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.json({
      message: "Google OAuth successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        avatar: user.avatar,
        googleId: user.googleId,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});
export default googleRouter;