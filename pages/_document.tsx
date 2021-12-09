import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx: any) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		const GTag = "G-CFSW8Y0R6K";
		return (
			<Html>
				<Head>
					{process.env.NODE_ENV === "production" && (
						<>
							<script
								async
								type="text/javascript"
								src={`https://www.googletagmanager.com/gtag/js?id=${GTag}`}
							/>
							{/* <!-- Google Tag Manager --> */}
							<script
								dangerouslySetInnerHTML={{
									__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
								})(window,document,'script','dataLayer','GTM-PWX4GJW');`,
								}}
							/>
							{/* <!-- End Google Tag Manager --> */}
							<script
								dangerouslySetInnerHTML={{
									__html: `
										window.dataLayer = window.dataLayer || [];
										function gtag(){dataLayer.push(arguments);}
										gtag('js', new Date());
										gtag('config', '${GTag}', { page_path: window.location.pathname });
										`,
								}}
							/>
						</>
					)}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
