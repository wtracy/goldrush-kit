import {
    GRK_SIZES,
    allowedCacheChains,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import type { Chain, ChainItem } from "@covalenthq/client-sdk";
import {
    prettifyCurrency,
    type NftTokenContractBalanceItem,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { AccountCard } from "@/components/Molecules";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoldRush } from "@/utils/store";
import { type NFTPickerProps } from "@/utils/types/organisms.types";
import { TokenAvatar } from "@/components/Atoms";

export const NFTPicker: React.FC<NFTPickerProps> = ({
    chain_names,
    address,
    on_nft_click
}) => {
    const [maybeResult, setMaybeResult] =
        useState<
            Option<(NftTokenContractBalanceItem & { chain_name: Chain })[]>
        >(None);
    const { covalentClient, chains } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            const promises = chain_names.map(async (chain_name) => {
                const cache = !allowedCacheChains.includes(chain_name);
                try {
                    const { data, ...error } =
                        await covalentClient.NftService.getNftsForAddress(
                            chain_name,
                            address.trim(),
                            {
                                withUncached: cache,
                            }
                        );
                    if (error.error) {
                        setErrorMessage(error.error_message);
                        throw error;
                    }
                    return data.items.map((o) => {
                        return { ...o, chain_name };
                    });
                } catch (exception) {
                    console.error(exception);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            setMaybeResult(new Some(results.flat()));
        })();
    }, [chain_names, address]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {maybeResult.match({
                    None: () =>
                        [1, 2, 3, 4, 5, 6, 7, 8].map((o) => {
                            return (
                                <Skeleton
                                    key={o}
                                    isNFT
                                    size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                />
                            );
                        }),
                    Some: (result) =>
                        errorMessage ? (
                            <>{errorMessage}</>
                        ) : result.length === 0 ? (
                            <>No results</>
                        ) : (
                            result.flatMap((items) => {
                                const chain: ChainItem | null =
                                    chains?.find(
                                        (o) => o.name === items.chain_name
                                    ) ?? null;
                                const chainColor = chain?.color_theme.hex;
                                const isDarkMode =
                                    document.documentElement.classList.contains(
                                        "dark"
                                    );
                                return items.nft_data.map((nft, i) => (
                                    <Card
                                        key={items.contract_address+':'+i}
                                        className="w-[230px] rounded border"
                                        onClick={() => {
                                          if (on_nft_click) {
                                            on_nft_click(items, nft);
                                          }
                                        }}
                                    >
                                        <CardContent className="relative rounded bg-slate-100">
                                            <img
                                                className={`block h-[10rem] w-full rounded-t ${
                                                    nft.external_data?.image_512
                                                        ? "object-cover"
                                                        : "p-2"
                                                }`}
                                                src={
                                                    nft.external_data?.image_512
                                                        ? nft.external_data
                                                              .image_512
                                                        : "https://www.datocms-assets.com/86369/1685489960-nft.svg"
                                                }
                                                onError={(e) => {
                                                    e.currentTarget.classList.remove(
                                                        "object-cover"
                                                    );
                                                    e.currentTarget.classList.add(
                                                        "p-2"
                                                    );
                                                    e.currentTarget.src =
                                                        "https://www.datocms-assets.com/86369/1685489960-nft.svg";
                                                }}
                                            />
                                        </CardContent>
                                        <div className="p-4">
                                            <CardDescription>
                                                {" "}
                                                {items.contract_name}
                                            </CardDescription>
                                            <CardTitle className="truncate">
                                                #{nft.token_id?.toString()}
                                            </CardTitle>
                                        </div>
                                    </Card>
                                ));
                            })
                        ),
                })}
            </div>
        </div>
    );
};
