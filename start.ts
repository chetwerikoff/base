import { privateKeyConvert, readWallets } from "./utils/wallet"
import { random, randomFloat, shuffle, sleep } from "./utils/common"
import { binanceConfig, bridgeConfig, generalConfig, mintfunConfig, odosConfig } from "./config"
import { makeLogger } from "./utils/logger"
import { entryPoint } from "./utils/menu"
import { Bridge } from "./modules/bridge"
import { Mintfun } from "./modules/mintfun"
import { L2Telegraph } from "./modules/l2telegraph"
import { Merkly } from "./modules/merkly"
import { Baseswap } from "./modules/baseswap"
import { Pancake } from "./modules/pancake"
import { Uniswap } from "./modules/uniswap"
import { Woofi } from "./modules/woofi"
import { Aave } from "./modules/aave"
import { Odos } from "./modules/odos"
import { waitGas } from "./utils/getCurrentGas"
import { Binance } from "./modules/binance"
import { on } from "events"

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
})

let privateKeys = readWallets('./private_keys.txt')

if (generalConfig.shuffleWallets) {
    shuffle(privateKeys)
}

let proxies: Array<string|null>
if (odosConfig.useProxy) {
    proxies = readWallets('./proxies.txt')
}

async function bridgeModule() {
    const logger = makeLogger("Bridge")
    for (let privateKey of privateKeys) {
        const bridge = new Bridge(privateKeyConvert(privateKey))
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        const sum = randomFloat(bridgeConfig.stargateBridgeFrom, bridgeConfig.stargateBridgeTo)

        if (bridgeConfig.type === 'stargate') {
            if (bridgeConfig.stargateFrom === 'arbitrum') {
                await bridge.stargateArbitrumToBase(sum.toString())
            } else if (bridgeConfig.stargateFrom === 'optimism') {
                await bridge.stargateOptimismToBase(sum.toString())
            } else if (bridgeConfig.stargateFrom === 'random') {
                const randomChooice: number = random(1, 2)
                if (randomChooice === 1) {
                    await bridge.stargateArbitrumToBase(sum.toString())
                } else {
                    await bridge.stargateOptimismToBase(sum.toString())
                }
            }
        } else {
            const officialBridgeSum = randomFloat(bridgeConfig.bridgeFrom, bridgeConfig.bridgeTo)
            if (await waitGas()) {
                await bridge.bridge(officialBridgeSum.toString())
            }
        }
        
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function mintfunModule() {
    const logger = makeLogger("Mintfun")
    for (let privateKey of privateKeys) {
        const mintfun = new Mintfun(privateKeyConvert(privateKey))
        const txCount = random(mintfunConfig.countFrom, mintfunConfig.countTo)

        for (let i = 1; i <= txCount; i++) {
            const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
            await mintfun.mintRandom()

            if (txCount > 1) {
                logger.info(`Waiting ${sleepTime} sec until next mint...`)
                await sleep(sleepTime * 1000)
            }
        }

        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function l2telegraphModule() {
    const logger = makeLogger("L2Telegraph")
    for (let privateKey of privateKeys) {
        const l2telegraph = new L2Telegraph(privateKeyConvert(privateKey))
        await l2telegraph.mintAndBridge()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function l2telegraphMessageModule() {
    const logger = makeLogger("L2Telegraph")
    for (let privateKey of privateKeys) {
        const l2telegraphMessage = new L2Telegraph(privateKeyConvert(privateKey))
        await l2telegraphMessage.sendMessage()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function merklyRefuelModule() {
    const logger = makeLogger("Merkly")
    for (let privateKey of privateKeys) {
        const merkly = new Merkly(privateKeyConvert(privateKey))
        await merkly.refuel()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function baseswapModule() {
    const logger = makeLogger("Baseswap")
    for (let privateKey of privateKeys) {
        const baseswap = new Baseswap(privateKeyConvert(privateKey))
        await baseswap.roundSwap()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function pancakeModule() {
    const logger = makeLogger("Pancake")
    for (let privateKey of privateKeys) {
        const pancake = new Pancake(privateKeyConvert(privateKey))
        await pancake.roundSwap()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function uniswapModule() {
    const logger = makeLogger("Uniswap")
    for (let privateKey of privateKeys) {
        const uniswap = new Uniswap(privateKeyConvert(privateKey))
        await uniswap.roundSwap()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function woofiModule() {
    const logger = makeLogger("Woofi")
    for (let privateKey of privateKeys) {
        const woofi = new Woofi(privateKeyConvert(privateKey))
        await woofi.roundSwap()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function odosModule() {
    const logger = makeLogger("Odos")
    for (const [index, privateKey] of privateKeys.entries()) {
        const odos = new Odos(privateKeyConvert(privateKey))
        await odos.roundSwap(odosConfig.useProxy ? proxies[index] : null)
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function aaveModule() {
    const logger = makeLogger("Aave")
    for (let privateKey of privateKeys) {
        const aave = new Aave(privateKeyConvert(privateKey))
        await aave.run()
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function binanceModule() {
    const logger = makeLogger("Binance")
    for (let privateKey of privateKeys) {
        const sum = randomFloat(binanceConfig.withdrawFrom, binanceConfig.withdrawTo)
        const binance = new Binance(privateKeyConvert(privateKey))
        await binance.withdraw(sum.toString())
        
        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function randomModule() {
    const logger = makeLogger("Random")
    for (let privateKey of privateKeys) {
        const randomChooice = random(1, 10)
        let sleepTime

        switch (randomChooice) {
            case 1:
                const mintfun = new Mintfun(privateKeyConvert(privateKey))
                await mintfun.mintRandom()
                break
            case 2:
                const l2telegraph = new L2Telegraph(privateKeyConvert(privateKey))
                await l2telegraph.mintAndBridge()
                break
            case 3:
                const l2telegraphMessage = new L2Telegraph(privateKeyConvert(privateKey))
                await l2telegraphMessage.sendMessage()
                break
            case 4:
                const merkly = new Merkly(privateKeyConvert(privateKey))
                await merkly.refuel()
                break
            case 5:
                const baseswap = new Baseswap(privateKeyConvert(privateKey))
                await baseswap.roundSwap()
                break
            case 6:
                const pancake = new Pancake(privateKeyConvert(privateKey))
                await pancake.roundSwap()
                break
            case 7:
                const uniswap = new Uniswap(privateKeyConvert(privateKey))
                await uniswap.roundSwap()
                break
            case 8:
                const woofi = new Woofi(privateKeyConvert(privateKey))
                await woofi.roundSwap()
                break
            case 9:
                const odos = new Odos(privateKeyConvert(privateKey))
                await odos.roundSwap()
                break
            case 10:
                const aave = new Aave(privateKeyConvert(privateKey))
                await aave.run()
                break
        }

        sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function randomSwapModule() {
    const logger = makeLogger("Random swap")
    for (let privateKey of privateKeys) {
        const randomChooice = random(1, 5)
        let sleepTime

        switch (randomChooice) {
            case 1:
                const baseswap = new Baseswap(privateKeyConvert(privateKey))
                await baseswap.roundSwap()
                break
            case 2:
                const pancake = new Pancake(privateKeyConvert(privateKey))
                await pancake.roundSwap()
                break
            case 3:
                const uniswap = new Uniswap(privateKeyConvert(privateKey))
                await uniswap.roundSwap()
                break
            case 4:
                const woofi = new Woofi(privateKeyConvert(privateKey))
                await woofi.roundSwap()
                break
            case 5:
                const odos = new Odos(privateKeyConvert(privateKey))
                await odos.roundSwap()
                break
        }

        sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function randomL0Module() {
    const logger = makeLogger("Random L0")
    for (let privateKey of privateKeys) {
        const randomChooice = random(1, 3)
        let sleepTime

        switch (randomChooice) {
            case 1:
                const l2telegraph = new L2Telegraph(privateKeyConvert(privateKey))
                await l2telegraph.mintAndBridge()
                break
            case 2:
                const l2telegraphMessage = new L2Telegraph(privateKeyConvert(privateKey))
                await l2telegraphMessage.sendMessage()
                break
            case 3:
                const merkly = new Merkly(privateKeyConvert(privateKey))
                await merkly.refuel()
                break
        }

        sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function stableSwapModule() {
    const logger = makeLogger("StableSwap")
    for (let privateKey of privateKeys) {
        const pancake = new Pancake(privateKeyConvert(privateKey))

        await pancake.swapStablesToEth()

        const sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function customModule() {
    const logger = makeLogger("Custom")
    let customModules = generalConfig.customModules

    for (let privateKey of privateKeys) {
        let sleepTime
        if (generalConfig.shuffleCustomModules) {
            shuffle(customModules)
        }
        for (let customModuleItem of customModules) {
            switch (customModuleItem) {
                case 'mintfun':
                    const mintfun = new Mintfun(privateKeyConvert(privateKey))
                    await mintfun.mintRandom()
                    break
                case 'l2telegraph':
                    const l2telegraph = new L2Telegraph(privateKeyConvert(privateKey))
                    await l2telegraph.mintAndBridge()
                    break
                case 'l2telegraph_message':
                    const l2telegraphMessage = new L2Telegraph(privateKeyConvert(privateKey))
                    await l2telegraphMessage.sendMessage()
                    break
                case 'merkly':
                    const merkly = new Merkly(privateKeyConvert(privateKey))
                    await merkly.refuel()
                    break
                case 'baseswap':
                    const baseswap = new Baseswap(privateKeyConvert(privateKey))
                    await baseswap.roundSwap()
                    break
                case 'pancake':
                    const pancake = new Pancake(privateKeyConvert(privateKey))
                    await pancake.roundSwap()
                    break
                case 'uniswap':
                    const uniswap = new Uniswap(privateKeyConvert(privateKey))
                    await uniswap.roundSwap()
                    break
                case 'woofi':
                    const woofi = new Woofi(privateKeyConvert(privateKey))
                    await woofi.roundSwap()
                    break
                case 'odos':
                    const odos = new Odos(privateKeyConvert(privateKey))
                    await odos.roundSwap()
                    break
                case 'aave':
                    const aave = new Aave(privateKeyConvert(privateKey))
                    await aave.run()
                    break
            }
        }

        sleepTime = random(generalConfig.sleepFrom, generalConfig.sleepTo)
        logger.info(`Waiting ${sleepTime} sec until next wallet...`)
        await sleep(sleepTime * 1000)
    }
}

async function startMenu() {
    let mode = await entryPoint()
    switch (mode) {
        case "bridge":
            await bridgeModule()
            break
        case "binance":
            await binanceModule()
            break
        case "merkly":
            await merklyRefuelModule()
            break
        case "aave":
            await aaveModule()
            break
        case "odos":
            await odosModule()
            break
        case "pancake":
            await pancakeModule()
            break
        case "uniswap":
            await uniswapModule()
            break
        case "baseswap":
            await baseswapModule()
            break
        case "woofi":
            await woofiModule()
            break
        case "mintfun":
            await mintfunModule()
            break
        case "l2telegraph":
            await l2telegraphModule()
            break
        case "l2telegraph_message":
            await l2telegraphMessageModule()
            break
        case "random":
            await randomModule()
            break
        case "random_swap":
            await randomSwapModule()
            break
        case "random_l0":
            await randomL0Module()
            break
        case "stable_to_eth":
            await stableSwapModule()
            break
        case "custom":
            await customModule()
            break
    }
}

await startMenu()