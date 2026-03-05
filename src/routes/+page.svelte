<script>
	import background from '$lib/assets/bg.jpg';

	let { data } = $props();
	const fallbackImages = [
		'/bild1.jpg',
		'/diamant.jpg',
		'/earring.jpg',
		'/goldring.jpg',
		'/silverring.jpg'
	];

	const getValue = (obj, keys) => {
		for (const key of keys) {
			if (obj?.[key] !== undefined && obj?.[key] !== null && obj?.[key] !== '') return obj[key];
		}
		return null;
	};

	const resolveImageSrc = (value) => {
		if (!value || typeof value !== 'string') return null;
		if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) return value;
		return `/${value}`;
	};
</script>

<svelte:head>
    <title>Jewelry - Webshop</title>
    <meta property="og:title" content="Jewelry - Webshop" />
    <meta name="description" content="Discover our exquisite collection of jewelry, crafted with precision and passion. From elegant necklaces to stunning rings, find the perfect piece to complement your style. Shop now and elevate your look with our timeless designs." />
    <meta property="og:image" content="{background}" />
</svelte:head>

<header
	class="flex h-[500px] items-center justify-center bg-cover bg-center"
	style="background-image: url('{background}')"
>
	<h1 class="text-5xl">Jewelry</h1>
</header>

<main class="mx-auto max-w-5xl p-6">
	<h2 class="mb-4 text-2xl">Produkte</h2>

	{#if data.error}
		<p class="rounded border border-red-200 bg-red-50 p-4 text-red-700">{data.error}</p>
	{:else if data.products.length === 0}
		<p class="rounded border border-amber-200 bg-amber-50 p-4 text-amber-700">
			Keine Produkte gefunden.
		</p>
	{:else}
		<p class="mb-4 text-sm text-slate-600">Tabelle: {data.table}</p>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.products as product, index}
				{@const title = getValue(product, ['name', 'title', 'produktname', 'product_name'])}
				{@const price = getValue(product, ['price', 'preis', 'cost'])}
				{@const description = getValue(product, ['description', 'beschreibung', 'details'])}
				{@const image = getValue(product, ['image', 'image_url', 'img', 'bild', 'thumbnail'])}
				{@const imageSrc = resolveImageSrc(image)}
				{@const fallbackImage = fallbackImages[index % fallbackImages.length]}

				<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					<div class="flex h-44 w-full items-center justify-center bg-slate-100">
						{#if imageSrc}
							<img src={imageSrc} alt={title || 'Produkt'} class="h-44 w-full object-cover" />
						{:else}
							<img src={fallbackImage} alt="Produktbild Platzhalter" class="h-44 w-full object-cover" />
						{/if}
					</div>

					<div class="space-y-2 p-4">
						<h3 class="text-lg font-semibold text-slate-900">
							{title || 'Produkt'}
						</h3>
						{#if price !== null}
							<p class="text-base font-bold text-emerald-700">{price} EUR</p>
						{/if}
						{#if description}
							<p class="text-sm text-slate-600">{description}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>


<footer class="h-[300px] bg-amber-950 text-white flex items-center justify-center">
    <p>Test-page for SEO</p>
</footer>
