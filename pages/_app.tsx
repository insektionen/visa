import '@fontsource/open-sans/variable.css';
import '@fontsource/open-sans/variable-italic.css';
import '@fontsource/source-code-pro/variable.css';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default MyApp;
