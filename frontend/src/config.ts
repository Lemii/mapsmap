const config = {
	api: process.env.REACT_APP_WS_API || 'ws://localhost:8080/ws',
	fundPassphrase: process.env.REACT_APP_FUND_PASSPHRASE, // Only used for demo purposes
	addressPrefix: 'map',
	ticker: 'MAPX',
	problemDescriptionLimit: 800,
	solutionDescriptionLimit: 1200,
};

export default config;
