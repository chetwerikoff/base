export const generalConfig = {
    sleepFrom: 60,
    sleepTo: 150,
    shuffleWallets: true,
    shuffleCustomModules: false,
    customModules: ['l2telegraph', 'mintfun', 'uniswap']
    // 'aave', 'baseswap', 'l2telegraph', 'l2telegraph_message', 'merkly', 'mintfun', 'odos', 'pancake', 'uniswap', 'woofi'
}

export const bridgeConfig = {
    type: 'official', // 'stargate', 'official'
    stargateFrom: 'arbitrum', // 'arbitrum', 'optimism', 'random'
    bridgeFrom: 0.001,
    bridgeTo: 0.002,
    stargateBridgeFrom: 0.003,
    stargateBridgeTo: 0.004,
    maxGas: 10 // for official bridge Eth -> Base
}

export const binanceConfig = {
    key: '',
    secret: '',
    withdrawFrom: 0.001, // min: 0.001
    withdrawTo: 0.0013,
    useRefill: false
}

export const mintfunConfig = {
    countFrom: 1,
    countTo: 2
}

export const swapConfig = {
    swapEthPercentFrom: 20,
    swapEthPercentTo: 30
}

export const aaveConfig = {
    depositEthPercentFrom: 20,
    depositEthPercentTo: 30,
    makeWithdraw: true
}

export const odosConfig = {
    useProxy: true,
    useReferral: true
}