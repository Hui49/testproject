export const config = {
    jwt: {
      expiresIn: '300s', // Default token expiration time
      secret: '123456789', // JWT secret
    },
    openaiAccessToken: process.env.OPENAI_ACCESS_TOKEN || '', // Provide a default value or handle missing value appropriately
  };