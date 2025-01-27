import { type Meta, type StoryObj } from "@storybook/react";
import { ChainSelector as ChainSelectorComponent } from "./ChainSelector";

type Story = StoryObj<typeof ChainSelectorComponent>;

const meta: Meta<typeof ChainSelectorComponent> = {
    title: "Molecules/Chain Selector",
    component: ChainSelectorComponent,
};

export default meta;

export const ChainSelector: Story = {
    args: {
        chain_options: [
            "eth-mainnet",
            "matic-mainnet",
            "arbitrum-mainnet",
            "solana-mainnet",
        ],
    },
};
