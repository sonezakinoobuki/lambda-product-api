"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dbConfig = {
    host: process.env.DB_HOST, // .envに記載
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};
exports.handler = async (event) => {
    const conn = await promise_1.default.createConnection(dbConfig);
    if (event.httpMethod === 'GET') {
        const [rows] = await conn.query('SELECT * FROM products ORDER BY id DESC');
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(rows)
        };
    }
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body || '{}');
        await conn.execute('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)', [
            body.name,
            body.price,
            body.stock
        ]);
        return {
            statusCode: 201,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Product added' })
        };
    }
    if (event.httpMethod === 'DELETE') {
        const id = event.pathParameters?.id;
        if (!id)
            return { statusCode: 400, body: 'Missing ID' };
        await conn.execute('DELETE FROM products WHERE id = ?', [id]);
        return {
            statusCode: 204,
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }
    return { statusCode: 405, body: 'Method Not Allowed' };
};
