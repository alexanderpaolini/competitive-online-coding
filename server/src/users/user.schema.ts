import { Schema, Document } from 'mongoose';

export interface User extends Document {
    githubId: string;
    username: string;
    email: string;
    elo: number;
    clanId?: string;
}

export const UserSchema = new Schema({
    githubId: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    email: { type: String, required: false },
    elo: { type: Number, default: 1500 },
    clanId: { type: String, required: false },
});
