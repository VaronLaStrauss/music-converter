<script lang="ts">
	import { convert } from 'convert-audio';
	import JSZip from 'jszip';

	let downloadButton: HTMLAnchorElement;
	let disabled = false;

	async function startConversion(this: HTMLFormElement) {
		disabled = true;
		const data = new FormData(this);
		const files = data.getAll('files') as File[];
		const type = data.get('type') as string;
		const convertedFiles = await Promise.all(files.map((f) => convert(f, type)));
		const newFiles = await Promise.all(
			convertedFiles.map(async (d) => {
				const res = await fetch(d.data);
				const blob = await res.blob();
				return {
					...d,
					data: blob
				};
			})
		);

		const zip = new JSZip();
		newFiles.forEach((f) => zip.file(`${f.name}.${f.format}`, f.data));
		const zipped = await zip.generateAsync({ type: 'blob' });
		const url = window.URL.createObjectURL(zipped);
		downloadButton.href = url;
		downloadButton.download = 'Files.zip';
		downloadButton.click();

		window.URL.revokeObjectURL(url);
		disabled = false;
	}
</script>

<form on:submit|preventDefault={startConversion}>
	<label for="files">Files</label>
	<input id="files" name="files" type="file" multiple {disabled} />
	<label for="type">Convert To Type</label>
	<select name="type" id="type" {disabled}>
		<option value="mp3">mp3</option>
		<option value="mp4">mp4</option>
		<option value="wav">wav</option>
		<option value="flac">flac</option>
	</select>
	<button {disabled} type="submit">Convert</button>
	<a href="#" bind:this={downloadButton} />
</form>
