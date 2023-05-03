import pool from '@/utils/db';
import { ErrorMessage, TodoItem } from '@/utils/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = TodoItem[] | ErrorMessage;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    let numArgs = 1;
    const { search, completed, size  } = req.query;
    let query = 'SELECT * FROM todo WHERE';
    const values = [];

    if (search) {
      query += ` text ILIKE $${numArgs}`;
      values.push(`%${search}%`);
      numArgs++;
    } else {
      // query += ' 1=1';
    }

    if (completed) {
        if (search) {
            query += '  ' + search ? ' AND' : '';
            query += ` completed = $${numArgs}`;
        } else {
            query += ` completed = $${numArgs}`;
        }
      values.push(completed);
    }

    
    if (size) {
        query += ` LIMIT $${numArgs}`;
        values.push(size);
      }

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}