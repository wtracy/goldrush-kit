import { type Meta, type StoryObj } from "@storybook/react";
import { BlockTransactions as BlockTransactionsComponent } from "./BlockTransactions";

type Story = StoryObj<typeof BlockTransactionsComponent>;

const meta: Meta<typeof BlockTransactionsComponent> = {
    title: "Organisms/Block Transactions",
    component: BlockTransactionsComponent,
};

export default meta;

export const BlockTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
        block_height: 19575410,
    },
};
