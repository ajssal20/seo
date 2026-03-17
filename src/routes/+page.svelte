<script>
	import { resolve } from '$app/paths';
	import background from '$lib/assets/bg.jpg';
	import {
		DESCRIPTION_KEYS,
		getImageSrc,
		getValue,
		PRICE_KEYS,
		stripHtml,
		TITLE_KEYS
	} from '$lib/product-utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Atelier Schmuck | Auswahl mit Charakter</title>
	<meta property="og:title" content="Atelier Schmuck | Auswahl mit Charakter" />
	<meta
		name="description"
		content="Entdecken Sie eine kuratierte Schmuckauswahl mit warmer Bildsprache, klarer Präsentation und hochwertigem Auftritt."
	/>
	<meta property="og:image" content={background} />
</svelte:head>

<section class="stage">
	<div class="stage__panel" style={`--stage-image: url(${background})`}>
		<div class="stage__intro">
			<p class="stage__kicker">Kuratiertes Schmuckatelier</p>
			<h1>Schmuck, der ruhig wirkt und trotzdem sofort auffällt.</h1>
			<p class="stage__lead">
				Eine sorgfältig aufgebaute Auswahl für Geschenke, besondere Anlässe und den eleganten Alltag.
			</p>
		</div>

		<div class="stage__aside">
			<div class="stage__note">
				<span>Auswahl</span>
				<strong>Feine Stücke mit klarer, hochwertiger Präsentation.</strong>
			</div>
			<a href="#kollektion" class="stage__cta">Zur Kollektion</a>
		</div>
	</div>
</section>

<main class="showcase">
	<section class="showcase__headline" id="kollektion">
		<p class="showcase__label">Unsere Auswahl</p>
		<h2>Für einen eigenständigen Auftritt gestaltet, nicht wie ein gewöhnlicher Standard-Shop.</h2>
		<p>
			Die Inhalte sind bewusst auf Deutsch formuliert und in einer magazinartigeren Struktur angeordnet,
			damit die Seite eigenständiger wirkt und sich klar vom ursprünglichen Aufbau absetzt.
		</p>
	</section>

	{#if data.error}
		<p class="state state--error">{data.error}</p>
	{:else if data.products.length === 0}
		<p class="state state--empty">Keine Produkte gefunden.</p>
	{:else}
		<section class="feature-strip">
			<div>
				<span>01</span>
				<p>Warme Bildsprache und ruhige Farbigkeit</p>
			</div>
			<div>
				<span>02</span>
				<p>Stärkerer Fokus auf Produkt und Wirkung</p>
			</div>
			<div>
				<span>03</span>
				<p>Reduzierte Struktur für einen edleren Eindruck</p>
			</div>
		</section>

		<div class="collection-list">
			{#each data.products as product, index (index)}
				{@const title = getValue(product, TITLE_KEYS)}
				{@const price = getValue(product, PRICE_KEYS)}
				{@const description = getValue(product, DESCRIPTION_KEYS)}
				{@const imageSrc = getImageSrc(product)}
				{@const href = resolve('/produkt/[id]', { id: product._routeId })}

				<a {href} class="collection-item">
					<div class="collection-item__index">{String(index + 1).padStart(2, '0')}</div>
					<div class="collection-item__visual">
						{#if imageSrc}
							<img
								src={imageSrc}
								alt={stripHtml(title || 'Produkt')}
								class="collection-item__image"
								loading="lazy"
							/>
						{:else}
							<div class="collection-item__image collection-item__image--empty">
								<span>Atelier Schmuck</span>
							</div>
						{/if}
					</div>

					<div class="collection-item__content">
						<p class="collection-item__tag">Ausgewähltes Stück</p>
						<h3>{stripHtml(title || 'Produkt')}</h3>
						{#if description}
							<p class="collection-item__description">{stripHtml(description)}</p>
						{/if}
					</div>

					<div class="collection-item__aside">
						{#if price !== null}
							<p class="collection-item__price">{stripHtml(price)} EUR</p>
						{/if}
						<span class="collection-item__link">Details ansehen</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>

<footer class="footer">
	<p>Atelier Schmuck</p>
	<p>Eigenständige Produktpräsentation für SEO, Sichtbarkeit und einen hochwertigeren ersten Eindruck.</p>
</footer>

<style>
	:global(body) {
		margin: 0;
		background:
			linear-gradient(180deg, rgba(248, 241, 233, 0.9), rgba(255, 250, 245, 0.96)),
			#f5eee6;
		color: #241914;
		font-family: Georgia, 'Times New Roman', serif;
	}

	.stage {
		padding: 1.2rem;
	}

	.stage__panel {
		min-height: 38rem;
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.65fr);
		align-items: end;
		gap: 2rem;
		padding: 3rem;
		border-radius: 2rem;
		background:
			linear-gradient(110deg, rgba(34, 22, 15, 0.72) 0%, rgba(34, 22, 15, 0.26) 52%, rgba(255, 248, 240, 0.18) 100%),
			var(--stage-image);
		background-size: cover;
		background-position: center;
		box-shadow: 0 28px 70px rgba(74, 53, 39, 0.16);
	}

	.stage__intro {
		max-width: 44rem;
		color: #fff7ef;
	}

	.stage__kicker,
	.showcase__label,
	.collection-item__tag,
	.footer p:first-child {
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.stage__kicker,
	.showcase__label,
	.collection-item__tag {
		margin: 0 0 1rem;
		font-size: 0.78rem;
	}

	.stage__intro h1 {
		margin: 0;
		font-size: clamp(3rem, 7vw, 6rem);
		line-height: 0.92;
		font-weight: 500;
	}

	.stage__lead {
		max-width: 30rem;
		margin: 1.5rem 0 0;
		font-size: 1.05rem;
		line-height: 1.8;
		color: rgba(255, 247, 239, 0.84);
	}

	.stage__aside {
		display: grid;
		gap: 1rem;
		align-content: end;
	}

	.stage__note {
		padding: 1.35rem;
		border: 1px solid rgba(255, 237, 214, 0.28);
		border-radius: 1.4rem;
		background: rgba(255, 249, 240, 0.12);
		backdrop-filter: blur(6px);
		color: #fff8f1;
	}

	.stage__note span {
		display: block;
		margin-bottom: 0.55rem;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 232, 201, 0.76);
	}

	.stage__note strong {
		font-size: 1.05rem;
		line-height: 1.6;
		font-weight: 500;
	}

	.stage__cta {
		display: inline-flex;
		justify-content: center;
		padding: 1rem 1.4rem;
		border-radius: 999px;
		background: #f2dfc2;
		color: #2d2117;
		text-decoration: none;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.showcase {
		max-width: 78rem;
		margin: 0 auto;
		padding: 3rem 1.2rem 5rem;
	}

	.showcase__headline {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 2rem;
		margin-bottom: 2rem;
		align-items: start;
	}

	.showcase__headline h2 {
		margin: 0;
		font-size: clamp(2.1rem, 4vw, 4rem);
		line-height: 1.02;
		font-weight: 500;
	}

	.showcase__headline p:last-child {
		margin: 1.8rem 0 0;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		line-height: 1.8;
		color: #68584c;
	}

	.feature-strip {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.feature-strip div {
		padding: 1.15rem 1.2rem;
		border: 1px solid rgba(127, 101, 73, 0.16);
		border-radius: 1.2rem;
		background: rgba(255, 252, 248, 0.84);
	}

	.feature-strip span {
		display: inline-block;
		margin-bottom: 0.65rem;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		color: #9b764f;
	}

	.feature-strip p {
		margin: 0;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		line-height: 1.55;
		color: #4f4035;
	}

	.collection-list {
		display: grid;
		gap: 1rem;
	}

	.collection-item {
		display: grid;
		grid-template-columns: 4rem minmax(15rem, 20rem) minmax(0, 1fr) minmax(10rem, 12rem);
		gap: 1.25rem;
		align-items: center;
		padding: 1rem;
		border: 1px solid rgba(127, 101, 73, 0.16);
		border-radius: 1.6rem;
		background: rgba(255, 252, 248, 0.84);
		color: inherit;
		text-decoration: none;
		box-shadow: 0 18px 40px rgba(85, 62, 43, 0.05);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.collection-item:hover,
	.collection-item:focus-visible {
		transform: translateY(-0.2rem);
		border-color: rgba(156, 121, 79, 0.34);
		box-shadow: 0 24px 50px rgba(85, 62, 43, 0.1);
	}

	.collection-item__index {
		align-self: start;
		padding-top: 0.35rem;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 0.86rem;
		font-weight: 700;
		color: #a17a4c;
	}

	.collection-item__visual {
		overflow: hidden;
		border-radius: 1.2rem;
	}

	.collection-item__image {
		display: block;
		width: 100%;
		height: 14rem;
		object-fit: cover;
		background: linear-gradient(135deg, #efe2d2, #d9bf9d);
	}

	.collection-item__image--empty {
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(57, 40, 28, 0.72);
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.collection-item__content h3 {
		margin: 0;
		font-size: clamp(1.4rem, 2vw, 2.1rem);
		line-height: 1.08;
		font-weight: 500;
	}

	.collection-item__description {
		margin: 0.8rem 0 0;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 0.98rem;
		line-height: 1.7;
		color: #66584f;
	}

	.collection-item__aside {
		display: grid;
		gap: 0.75rem;
		justify-items: end;
		text-align: right;
	}

	.collection-item__price {
		margin: 0;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		color: #7e5f35;
	}

	.collection-item__link {
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #37281e;
	}

	.state {
		padding: 1rem 1.1rem;
		border-radius: 1rem;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
	}

	.state--error {
		border: 1px solid #e4beb8;
		background: #fff4f1;
		color: #8d4038;
	}

	.state--empty {
		border: 1px solid #e4d5b8;
		background: #fffaf0;
		color: #886735;
	}

	.footer {
		padding: 2rem 1.2rem 3rem;
		text-align: center;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		color: #6b5b4e;
	}

	.footer p:first-child {
		margin-bottom: 0.45rem;
		font-weight: 700;
		color: #3b2b1f;
	}

	@media (max-width: 900px) {
		.stage__panel,
		.showcase__headline,
		.collection-item {
			grid-template-columns: 1fr;
		}

		.collection-item__aside {
			justify-items: start;
			text-align: left;
		}

		.feature-strip {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.stage {
			padding: 0.75rem;
		}

		.stage__panel {
			min-height: auto;
			padding: 1.6rem;
		}

		.showcase {
			padding-top: 2rem;
		}
	}
</style>
