<script>
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.product.name} | Atelier Schmuck</title>
	<meta
		name="description"
		content={data.product.description || `${data.product.name} bei Atelier Schmuck`}
	/>
</svelte:head>

<section class="detail-page">
	<div class="detail-page__header">
		<a href={resolve('/')} class="detail-page__back">Zuruck zur Ubersicht</a>
		<p class="detail-page__eyebrow">Produktansicht</p>
	</div>

	<div class="detail-card">
		<div class="detail-card__media">
			{#if data.product.imageUrl}
				<img src={data.product.imageUrl} alt={data.product.name} />
			{:else}
				<div class="detail-card__fallback">Atelier Schmuck</div>
			{/if}
		</div>

		<div class="detail-card__copy">
			<p class="detail-card__label">Aus dem Atelier</p>
			<h1>{data.product.name}</h1>

			{#if data.product.price}
				<p class="detail-card__price">{data.product.price} EUR</p>
			{/if}

			{#if data.product.description}
				<p class="detail-card__description">{data.product.description}</p>
			{:else}
				<p class="detail-card__description">
					Ein ausgewahltes Schmuckstuck mit klarer, hochwertiger Darstellung und ruhiger Gesamtwirkung.
				</p>
			{/if}

			<div class="detail-card__notes">
				<div>
					<span>Stil</span>
					<p>Elegant, reduziert und fur einen hochwertigen ersten Eindruck aufgebaut.</p>
				</div>
				<div>
					<span>Prasentation</span>
					<p>Bewusst klarer aufgebaut, damit die Seite eigenstandiger und weniger austauschbar wirkt.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.detail-page {
		max-width: 78rem;
		margin: 0 auto;
		padding: 1.25rem 1.25rem 4rem;
	}

	.detail-page__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.detail-page__back,
	.detail-page__eyebrow,
	.detail-card__label,
	.detail-card__notes span {
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.16em;
	}

	.detail-page__back {
		color: #4a382b;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.detail-page__eyebrow,
	.detail-card__label {
		margin: 0;
		font-size: 0.78rem;
		color: #9f7a4c;
	}

	.detail-card {
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
		gap: 1.5rem;
		padding: 1rem;
		border: 1px solid rgba(126, 102, 76, 0.16);
		border-radius: 2rem;
		background: rgba(255, 252, 247, 0.88);
		box-shadow: 0 24px 60px rgba(85, 62, 43, 0.08);
	}

	.detail-card__media {
		overflow: hidden;
		border-radius: 1.5rem;
		background: linear-gradient(135deg, #efe2d2, #d9bf9d);
	}

	.detail-card__media img,
	.detail-card__fallback {
		display: block;
		width: 100%;
		min-height: 38rem;
		object-fit: cover;
	}

	.detail-card__fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(57, 40, 28, 0.72);
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.detail-card__copy {
		display: grid;
		align-content: center;
		padding: 1rem 0.5rem;
	}

	.detail-card__copy h1 {
		margin: 0.7rem 0 0;
		font-size: clamp(2.4rem, 5vw, 4.8rem);
		line-height: 0.98;
		font-weight: 500;
		color: #281d17;
	}

	.detail-card__price {
		margin: 1.25rem 0 0;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		color: #7e5f35;
	}

	.detail-card__description {
		margin: 1.25rem 0 0;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		font-size: 1rem;
		line-height: 1.85;
		color: #66584f;
	}

	.detail-card__notes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.detail-card__notes div {
		padding: 1rem;
		border-radius: 1.1rem;
		background: #f6efe7;
	}

	.detail-card__notes span {
		display: inline-block;
		margin-bottom: 0.55rem;
		font-size: 0.72rem;
		color: #8e6a45;
	}

	.detail-card__notes p {
		margin: 0;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
		line-height: 1.65;
		color: #54453a;
	}

	@media (max-width: 900px) {
		.detail-card,
		.detail-card__notes {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.detail-page {
			padding: 0.85rem 0.85rem 3rem;
		}

		.detail-page__header {
			flex-direction: column;
			align-items: flex-start;
		}

		.detail-card__media img,
		.detail-card__fallback {
			min-height: 22rem;
		}
	}
</style>
