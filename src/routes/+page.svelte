<script>
	import background from '$lib/assets/bg.jpg';

	let { data } = $props();

	const getValue = (obj, keys) => {
		for (const key of keys) {
			if (obj?.[key] !== undefined && obj?.[key] !== null && obj?.[key] !== '') return obj[key];
		}
		return null;
	};

	const stripHtml = (value) => String(value ?? '').replace(/<[^>]*>/g, '').trim();
	const normalizeImageSrc = (value) => {
		if (value === undefined || value === null) return null;
		const raw = String(value).trim();
		if (!raw) return null;

		const urlMatch = raw.match(/(https?:\/\/[^\s"'<>]+)/i);
		if (urlMatch?.[1]) return urlMatch[1];
		if (raw.startsWith('res.cloudinary.com/')) return `https://${raw}`;
		if (raw.startsWith('//res.cloudinary.com/')) return `https:${raw}`;
		return null;
	};

	const getImageSrc = (product) => {
		const fromKnownColumns = getValue(product, [
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
		const directSrc = normalizeImageSrc(fromKnownColumns);
		if (directSrc) return directSrc;

		for (const [key, value] of Object.entries(product)) {
			if (!/(image|img|bild|photo|foto|thumbnail|cloudinary|url)/i.test(key)) continue;
			const src = normalizeImageSrc(value);
			if (src) return src;
		}

		return null;
	};

</script>

<svelte:head>
	<title>Jewelry - Webshop</title>
	<meta property="og:title" content="Jewelry - Webshop" />
	<meta
		name="description"
		content="Discover our exquisite collection of jewelry, crafted with precision and passion."
	/>
	<meta property="og:image" content={background} />
</svelte:head>

<header
	class="flex h-[420px] items-center justify-center bg-cover bg-center"
	style="background-image: url('{background}')"
>
	<h1 class="text-5xl text-white">Jewelry</h1>
</header>

<main class="mx-auto max-w-6xl p-6">
	<h2 class="mb-5 text-2xl font-semibold">Produkte</h2>

	{#if data.error}
		<p class="rounded border border-red-200 bg-red-50 p-4 text-red-700">{data.error}</p>
	{:else if data.products.length === 0}
		<p class="rounded border border-amber-200 bg-amber-50 p-4 text-amber-700">Keine Produkte gefunden.</p>
	{:else}
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.products as product, index (index)}
				{@const title = getValue(product, ['name', 'title', 'produktname', 'product_name'])}
				{@const price = getValue(product, ['price', 'preis', 'cost'])}
				{@const description = getValue(product, ['description', 'beschreibung', 'details'])}
				{@const imageSrc = getImageSrc(product)}

				<article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					{#if imageSrc}
						<img
							src={imageSrc}
							alt={stripHtml(title || 'Produkt')}
							class="h-44 w-full object-cover"
							loading="lazy"
						/>
					{/if}
					<div class="space-y-2 p-4">
						<h3 class="text-lg font-semibold text-slate-900">{stripHtml(title || 'Produkt')}</h3>
						{#if price !== null}
							<p class="font-bold text-emerald-700">{stripHtml(price)} EUR</p>
						{/if}
						{#if description}
							<p class="text-sm text-slate-600">{stripHtml(description)}</p>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}
</main>

<footer class="flex h-[220px] items-center justify-center bg-amber-950 text-white">
	<p>Test-page for SEO</p>
</footer>
