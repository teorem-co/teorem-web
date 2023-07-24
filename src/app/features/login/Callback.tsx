import {useEffect, useState} from "react";
import axios from "axios";

const [accessToken, setAccessToken] = useState<string | null>(null);
const authorizationEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const tokenEndpoint = 'https://oauth2.googleapis.com/token';
const clientID = '878111896844-8rdj7qv0ubevt6crkajbtvmd3mbhu63m.apps.googleusercontent.com';
const redirectURI = 'http://localhost:3000/dashboard';
const scope = 'profile email';

function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

function base64URLEncode(str: string): string {
    return btoa(str)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function generateCodeVerifier(): string {
    const codeVerifier = generateRandomString(64);
    return codeVerifier;
}

function generateCodeChallenge(codeVerifier: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    return base64URLEncode(String.fromCharCode.apply(null, Array.from(new Uint8Array(data))));
}

useEffect(() => {
    // Step 3: Handle the callback after successful user authentication
    const handleAuthorizationCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        if (authorizationCode) {
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = generateCodeChallenge(codeVerifier);

            try {
                const response = await axios.post(tokenEndpoint, {
                    grant_type: 'authorization_code',
                    code: authorizationCode,
                    redirect_uri: redirectURI,
                    client_id: clientID,
                    code_verifier: codeVerifier,
                });

                setAccessToken(response.data.access_token);
                console.log(accessToken);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        }
    };

    handleAuthorizationCallback();
}, []);
