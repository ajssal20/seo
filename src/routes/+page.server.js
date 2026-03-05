import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export const load = async () => {
	let connection;

	try {
		connection = await mysql.createConnection({
			host: env.DB_HOST,
			user: env.DB_USER,
			port: Number(env.DB_PORT),
			password: env.DB_PASSWORD,
			database: env.DB_NAME
		});

		const [tableRows] = await connection.query('SHOW TABLES');
		const tableNames = tableRows.map((row) => String(Object.values(row)[0]));

		if (tableNames.length === 0) {
			return { products: [], table: null, error: 'Keine Tabellen in der Datenbank gefunden.' };
		}

		const preferredTable = tableNames.find((name) =>
			/(^|_)(products?|produkte|artikel|items?)(_|$)/i.test(name)
		);
		const table = preferredTable || tableNames[0];

		const [products] = await connection.query(`SELECT * FROM \`${table.replace(/`/g, '``')}\``);

		return {
			products: JSON.parse(JSON.stringify(products)),
			table,
			error: null
		};
	} catch (error) {
		return {
			products: [],
			table: null,
			error: error instanceof Error ? error.message : 'Datenbankfehler'
		};
	} finally {
		if (connection) {
			await connection.end();
		}
	}
};
