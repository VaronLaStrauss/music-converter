declare module 'convert-audio' {
	import AudioConverter from 'convert-audio';

	type ConvertedFile = {
		format: string;
		data: string;
		name: string;
	};

	async function convert(file: File, target: string): Promise<ConvertedFile>;

	export { convert, ConvertedFile };
}
