import express, {Request} from 'express';
export interface ExtendRequest extends Request {
  user?: any;
}