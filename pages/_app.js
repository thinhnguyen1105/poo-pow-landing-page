import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Layout from '../components/layout';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useRouter } from 'next/router';
import Meta from '../components/Meta';
import UserContext from '../components/UserContext';
import { useRef } from 'react';
import {
	WalletProvider,
	AptosWalletAdapter,
	MartianWalletAdapter,
	FewchaWalletAdapter,
	PontemWalletAdapter,
	SpikaWalletAdapter,
	RiseWalletAdapter,
	FletchWalletAdapter
} from '@manahippo/aptos-wallet-adapter';
function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const pid = router.asPath;
	const scrollRef = useRef({
		scrollPos: 0,
	});
	const wallets = [
		new RiseWalletAdapter(),
		new MartianWalletAdapter(),
		new AptosWalletAdapter(),
		new FewchaWalletAdapter(),
		new PontemWalletAdapter(),
		new SpikaWalletAdapter(),
		new FletchWalletAdapter()
	];

	return (
		<>
			<Meta title="PooPow | NFT Marketplace" />

			<Provider store={store}>
				<ThemeProvider enableSystem={true} attribute="class">
					<WalletProvider
						wallets={wallets}
						autoConnect={false} /** allow auto wallet connection or not **/
						onError={(error) => {
							console.log('Handle Error Message', error);
						}}>
						<UserContext.Provider value={{ scrollRef: scrollRef }}>
							{pid === '/login' ? (
								<Component {...pageProps} />
							) : (
								<Layout>
									<Component {...pageProps} />
								</Layout>
							)}
						</UserContext.Provider>
					</WalletProvider>
				</ThemeProvider>
			</Provider>
		</>
	);
}

export default MyApp;
