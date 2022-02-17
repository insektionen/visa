// This file exists only as a proof of concept for a future song book

export const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

export function encode(num: number, alpha: string = ALPHABET): string {
	let binary = num.toString(2);
	binary = binary.padStart(binary.length + 6 - (binary.length % 6 || 6), '0');

	let res = '';

	for (let i = 0; i < binary.length; i += 6)
		res += alpha.charAt(parseInt(binary.substring(i, i + 6), 2));

	return res;
}

export function decode(str: string, alpha: string = ALPHABET): number {
	let binary = '';
	for (let i = 0; i < str.length; i++)
		binary += alpha.indexOf(str.charAt(i)).toString(2).padStart(6, '0');

	return parseInt(binary, 2);
}
