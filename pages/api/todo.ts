// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '@/utils/db';
import { ErrorMessage, TodoItem } from '@/utils/types';
import type { NextApiRequest, NextApiResponse } from 'next'



type Data = TodoItem[] | ErrorMessage

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { completed } = req.query;
        let query = 'SELECT * FROM todo';
        const values = [];
    
        if (completed !== undefined) {
          query += ' WHERE completed = $1';
          values.push(completed);
        }
    
        query += ' ORDER BY id DESC';
    
        const { rows } = await pool.query(query, values);
        res.status(200).json(rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;
    case 'POST':
      try {
        const { text, completed } = req.body;
        const { rows } = await pool.query('INSERT INTO todo (text, completed) VALUES ($1, $2) RETURNING id, text, completed', [text, completed]);
        res.status(201).json(rows[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;
    case 'PUT':
      try {
        const { id } = req.query;
        const { completed } = req.body;
        const data = await pool.query('UPDATE todo SET completed = $1 WHERE id = $2', [ completed, id]);
        // console.log("rows", data);
        res.status(200).json(data as any);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        let queryString = 'DELETE FROM todo';
        let queryParams = [];
        if (id) {
          queryString += ' WHERE id = $1';
          queryParams.push(id);
        }
        await pool.query(queryString, queryParams);
        res.status(204).end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
