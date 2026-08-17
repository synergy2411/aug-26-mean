import dotenv from 'dotenv';
dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'dev'}`,
});

export const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
};