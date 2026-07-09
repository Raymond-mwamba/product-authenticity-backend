const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

let dbInstance = null;

const getDb = async () => {
    if (!dbInstance) {
        dbInstance = await open({
            filename: path.join(__dirname, '../../database.sqlite'),
            driver: sqlite3.Database
        });
    }
    return dbInstance;
};

const pool = {
    query: async (sql, params = []) => {
        const db = await getDb();
        const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
        if (isSelect) {
            const rows = await db.all(sql, params);
            return [rows, null];
        } else {
            const result = await db.run(sql, params);
            return [{ insertId: result.lastID, affectedRows: result.changes }, null];
        }
    },
    getConnection: async () => {
        return {
            query: pool.query,
            release: () => {}
        };
    },
    end: async () => {
        if (dbInstance) {
            await dbInstance.close();
            dbInstance = null;
        }
    }
};

module.exports = pool;
