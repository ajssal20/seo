import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

const firstExistingKey = (row, keys) => {
	for (const key of keys) {
		if (row?.[key] !== undefined && row?.[key] !== null && String(row[key]).trim() !== '') return key;
	}
	return null;
};

const toValue = (row, keys) => {
	const key = firstExistingKey(row, keys);
	return key ? String(row[key]).trim().toLowerCase() : '';
};

const imageFromRow = (row) => {
	const key = firstExistingKey(row, [
		'image',
		'image_url',
		'imageurl',
		'img',
		'bild',
		'thumbnail',
		'photo',
		'foto',
		'cloudinary_url',
		'url'
	]);

	if (key) return String(row[key]).trim().toLowerCase();

	for (const [column, value] of Object.entries(row)) {
		if (!/(image|img|bild|photo|foto|thumbnail|cloudinary|url)/i.test(column)) continue;
		const text = String(value ?? '').trim().toLowerCase();
		if (text) return text;
	}

	return '';
};

const dedupeProducts = (rows) => {
	const seen = new Set();
	const unique = [];

	for (const row of rows) {
		const imageIdentity = imageFromRow(row);
		const idKey = firstExistingKey(row, ['id', 'product_id', 'produkt_id', 'artikel_id']);
		const identity =
			imageIdentity ||
			(idKey
				? `id:${String(row[idKey]).trim()}`
				: `fallback:${toValue(row, ['name', 'title', 'produktname', 'product_name'])}|${toValue(row, ['price', 'preis', 'cost'])}`);

		if (seen.has(identity)) continue;
		seen.add(identity);
		unique.push(row);
	}

	return unique;
};

const pickProductTable = (tableNames) => {
	const normalized = tableNames.map((name) => name.toLowerCase());
	const exactPriority = ['products', 'product', 'produkte', 'artikel', 'items', 'item'];

	for (const target of exactPriority) {
		const index = normalized.findIndex((name) => name === target);
		if (index !== -1) return tableNames[index];
	}

	const candidates = tableNames.filter((name) => {
		const lower = name.toLowerCase();
		const looksLikeProduct = /(products?|produkte|artikel|items?)/i.test(lower);
		const looksLikeImageTable = /(image|images|foto|photo|media|gallery|galerie)/i.test(lower);
		return looksLikeProduct && !looksLikeImageTable;
	});

	if (candidates.length > 0) return candidates[0];
	return tableNames[0];
};

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

		const table = pickProductTable(tableNames);

		const [products] = await connection.query(`SELECT * FROM \`${table.replace(/`/g, '``')}\``);
		const uniqueProducts = dedupeProducts(products);

		return {
			products: JSON.parse(JSON.stringify(uniqueProducts)),
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
