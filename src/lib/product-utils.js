export const ID_KEYS = ['id', 'product_id', 'produkt_id', 'artikel_id'];
export const TITLE_KEYS = ['name', 'title', 'produktname', 'product_name'];
export const PRICE_KEYS = ['price', 'preis', 'cost'];
export const DESCRIPTION_KEYS = ['description', 'beschreibung', 'details'];
export const IMAGE_KEYS = [
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
];

export const getValue = (obj, keys) => {
	for (const key of keys) {
		if (obj?.[key] !== undefined && obj?.[key] !== null && obj?.[key] !== '') return obj[key];
	}
	return null;
};

export const stripHtml = (value) =>
	String(value ?? '')
		.replace(/<[^>]*>/g, '')
		.trim();

export const normalizeImageSrc = (value) => {
	if (value === undefined || value === null) return null;
	const raw = String(value).trim();
	if (!raw) return null;

	const urlMatch = raw.match(/(https?:\/\/[^\s"'<>]+)/i);
	if (urlMatch?.[1]) return urlMatch[1];
	if (raw.startsWith('res.cloudinary.com/')) return `https://${raw}`;
	if (raw.startsWith('//res.cloudinary.com/')) return `https:${raw}`;
	return null;
};

export const getImageSrc = (product) => {
	const fromKnownColumns = getValue(product, IMAGE_KEYS);
	const directSrc = normalizeImageSrc(fromKnownColumns);
	if (directSrc) return directSrc;

	for (const [key, value] of Object.entries(product ?? {})) {
		if (!/(image|img|bild|photo|foto|thumbnail|cloudinary|url)/i.test(key)) continue;
		const src = normalizeImageSrc(value);
		if (src) return src;
	}

	return null;
};

export const getProductViewModel = (product) => ({
	name: stripHtml(getValue(product, TITLE_KEYS) || 'Produkt'),
	description: stripHtml(getValue(product, DESCRIPTION_KEYS) || ''),
	price: stripHtml(getValue(product, PRICE_KEYS) || ''),
	imageUrl: getImageSrc(product)
});
