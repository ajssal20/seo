import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import {
	DESCRIPTION_KEYS,
	getImageSrc,
	getProductViewModel,
	ID_KEYS,
	PRICE_KEYS,
	TITLE_KEYS
} from '$lib/product-utils';

const firstExistingKey = (row, keys) => {
	for (const key of keys) {
		if (row?.[key] !== undefined && row?.[key] !== null && String(row[key]).trim() !== '')
			return key;
	}
	return null;
};

const toValue = (row, keys) => {
	const key = firstExistingKey(row, keys);
	return key ? String(row[key]).trim().toLowerCase() : '';
};

const slugify = (value) =>
	String(value ?? '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const getRawProductId = (row) => {
	const key = firstExistingKey(row, ID_KEYS);
	return key ? String(row[key]).trim() : null;
};

export const getProductId = (row, fallbackIndex = 0) => {
	const rawId = getRawProductId(row);
	if (rawId) return rawId;

	const title = toValue(row, TITLE_KEYS);
	const price = toValue(row, PRICE_KEYS);
	const fallback = slugify([title, price, fallbackIndex + 1].filter(Boolean).join('-'));
	return fallback || `product-${fallbackIndex + 1}`;
};

const imageFromRow = (row) =>
	String(getImageSrc(row) ?? '')
		.trim()
		.toLowerCase();

const dedupeProducts = (rows) => {
	const seen = new Set();
	const unique = [];

	for (const row of rows) {
		const imageIdentity = imageFromRow(row);
		const rawId = getRawProductId(row);
		const identity =
			imageIdentity ||
			(rawId ? `id:${rawId}` : `fallback:${toValue(row, TITLE_KEYS)}|${toValue(row, PRICE_KEYS)}`);

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

const connect = () =>
	mysql.createConnection({
		host: env.DB_HOST,
		user: env.DB_USER,
		port: Number(env.DB_PORT),
		password: env.DB_PASSWORD,
		database: env.DB_NAME
	});

const serializeProducts = (products) => JSON.parse(JSON.stringify(products));

const withRouteIds = (products) =>
	products.map((product, index) => ({
		...product,
		_routeId: getProductId(product, index)
	}));

const enrichProduct = (product, index = 0) => ({
	...product,
	...getProductViewModel(product),
	_routeId: getProductId(product, index),
	descriptionHtml: String(
		DESCRIPTION_KEYS.find((key) => product?.[key] !== undefined && product?.[key] !== null)
			? product[
					DESCRIPTION_KEYS.find((key) => product?.[key] !== undefined && product?.[key] !== null)
				]
			: ''
	)
});

export const loadProducts = async () => {
	let connection;

	try {
		connection = await connect();

		const [tableRows] = await connection.query('SHOW TABLES');
		const tableNames = tableRows.map((row) => String(Object.values(row)[0]));

		if (tableNames.length === 0) {
			return { products: [], table: null, error: 'Keine Tabellen in der Datenbank gefunden.' };
		}

		const table = pickProductTable(tableNames);
		const [products] = await connection.query(`SELECT * FROM \`${table.replace(/`/g, '``')}\``);
		const uniqueProducts = withRouteIds(dedupeProducts(products));

		return {
			products: serializeProducts(uniqueProducts),
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

export const loadProductById = async (productId) => {
	const data = await loadProducts();

	if (data.error) {
		return {
			product: null,
			error: data.error
		};
	}

	const index = data.products.findIndex((product) => product._routeId === productId);
	if (index === -1) {
		return {
			product: null,
			error: 'Produkt nicht gefunden.'
		};
	}

	return {
		product: serializeProducts(enrichProduct(data.products[index], index)),
		error: null
	};
};
