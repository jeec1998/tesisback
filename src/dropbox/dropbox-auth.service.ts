// src/dropbox/dropbox-auth.service.ts
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { DropboxAuth } from 'dropbox';
dotenv.config();

@Injectable()
export class DropboxAuthService {
  constructor() {}

/*   async refreshAccessToken(): Promise<string> {
    const clientId = process.env.DROPBOX_APP_KEY;
    const clientSecret = process.env.DROPBOX_APP_SECRET;
    const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken || '',
      }),
    });
    

    if (!response.ok) {
      throw new Error(`Error refreshing Dropbox token: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;

    return this.accessToken;
  } */
  async refreshAccessToken(): Promise<string> {
    try {
      const auth = new DropboxAuth({
        clientId: process.env.DROPBOX_APP_KEY,
        clientSecret: process.env.DROPBOX_APP_SECRET,
        refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
        fetch,
      });
      await auth.checkAndRefreshAccessToken();  
      return auth.getAccessToken();
    } catch (error) {
      console.error('Error refreshing Dropbox token:', error);
      throw new Error('Error refreshing Dropbox token');
    }
  }
}
