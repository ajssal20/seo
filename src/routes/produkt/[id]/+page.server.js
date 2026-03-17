import { error } from '@sveltejs/kit';
import { loadProductById } from '$lib/server/products';

export async function load({ params }) {
	const data = await loadProductById(params.id);

	if (data.error) {
		throw error(data.error === 'Produkt nicht gefunden.' ? 404 : 500, data.error);
	}

	return {
		product: data.product
	};
}
