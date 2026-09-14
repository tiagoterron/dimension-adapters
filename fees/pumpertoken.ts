import { Adapter } from "../adapters/types";
import { CHAIN } from "../helpers/chains";
import { getUniV3LogAdapter } from "../helpers/uniswap";

// PUMPER -- pumper.tools' own governance/utility token -- trades on a single
// Uniswap V3 pool on Stable (PUMPER/WgUSDT, 1% fee tier). This is a SEPARATE
// listing from "Pumper Launchpad" (fees/pumper.ts): PUMPER was deployed via a
// standalone relaunch/airdrop, never through the launchpad's `launch()`, so
// it was never registered in PumperProtocolRegistry and is correctly excluded
// from that adapter's isolated launchpad-pools set. Mixing it back in there
// would misattribute revenue too: this pool has no protocol-fee-capture
// mechanism (unlike a launchpad-created token, nothing ever calls a
// `collectLpFees`-style harvest that routes a cut to a protocol vault) --
// 100% of its swap fees go straight to LPs, so Revenue is genuinely $0 here,
// not just unreported.
//
// Passing an explicit `pools:` list (rather than `factory:`) means this
// doesn't depend on Uniswap V3's own PoolCreated-log discovery at all -- the
// pool address is fixed and verified directly on-chain (token0=WgUSDT,
// token1=PUMPER, fee=10000).
const PUMPER_WGUSDT_POOL = "0xE545c5737b424050d39524D2231a20dd9B1B4eb2";

const fetch = getUniV3LogAdapter({
  pools: [PUMPER_WGUSDT_POOL],
  revenueRatio: 0, // no protocol-fee switch on this pool -- 100% to LPs
});

const adapter: Adapter = {
  version: 2,
  chains: [CHAIN.STABLE],
  fetch,
  start: "2026-08-30",
  methodology: {
    Fees: "Swap fees paid by users on the PUMPER/WgUSDT Uniswap V3 pool (1% fee tier) on Stable.",
    Revenue: "None -- this pool has no protocol-fee-capture mechanism; all swap fees accrue to liquidity providers.",
    SupplySideRevenue: "100% of swap fees, paid to liquidity providers.",
  },
};

export default adapter;
