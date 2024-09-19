/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { createToken } from '../Auth/auth.utils';
// Assumes you have a function to create JWT tokens

// Middleware to verify access token and refresh token
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get access token from cookies
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AppError(401, 'Access token is missing');
    }

    // Verify the access token
    jwt.verify(
      accessToken,
      config.jwt_access_secret as string,
      (err: any, decoded: any) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            // Access token expired, check refresh token
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
              throw new AppError(401, 'Refresh token is missing');
            }

            // Verify the refresh token
            jwt.verify(
              refreshToken,
              config.jwt_refresh_secret as string,
              (refreshErr: any, refreshDecoded: any) => {
                if (refreshErr) {
                  throw new AppError(
                    403,
                    'Refresh token is invalid or expired'
                  );
                }

                // Create a new access token
                const newAccessToken = createToken(
                  { email: refreshDecoded.email, role: refreshDecoded.role },
                  config.jwt_access_secret as string,
                  config.expire_in_access as string
                );

                // Set the new access token in the cookie
                res.cookie('accessToken', newAccessToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
                  sameSite: 'strict',
                });

                // Attach the decoded refresh token data to the request object
                req.user = refreshDecoded;
                next();
              }
            );
          } else {
            throw new AppError(403, 'Access token is invalid');
          }
        } else {
          // Token is valid, attach the decoded token data to the request object
          req.user = decoded;
          next();
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
