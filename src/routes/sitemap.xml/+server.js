import { loadProducts } from '$lib/server/products';

function escapeXml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export async function GET({ url }) {
	try {
		const baseUrl = url.origin;
		const { products, error } = await loadProducts();

		if (error) {
			throw new Error(error);
		}

		const productUrls = products
			.map((product) => product?._routeId)
			.filter(Boolean)
			.map((id) => `${baseUrl}/produkt/${encodeURIComponent(id)}`);

		const allUrls = [`${baseUrl}/`, ...new Set(productUrls)];
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((loc) => `<url><loc>${escapeXml(loc)}</loc></url>`).join('\n')}
</urlset>`;

		return new Response(xml, {
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'max-age=0, s-maxage=3600'
			}
		});
	} catch (error) {
		console.error('Sitemap generation failed:', error);
		return new Response('Failed to generate sitemap', { status: 500 });
	}
}
