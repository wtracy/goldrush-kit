import { Heading } from "@/components/Shared";
import { useGoldRush } from "@/utils/store";
import { NFTFloorPrice, NFTSalesCount } from "@/components/Molecules";
import { type Option, Some, None } from "@/utils/option";
import { type NFTDetailViewProps } from "@/utils/types/organisms.types";
import { type NftTokenContract } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    allowedCacheChains,
} from "@/utils/constants/shared.constants";

export const NFTDetailView: React.FC<NFTDetailViewProps> = ({
    chain_name,
    collection_address,
    token_id,
}) => {
    const [maybeResult, setResult] = useState<Option<NftTokenContract>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        let response;
        const cache = !allowedCacheChains.includes(chain_name);
        (async () => {
            try {
                response =
                    await covalentClient.NftService.getNftMetadataForGivenTokenIdForContract(
                        chain_name,
                        collection_address,
                        token_id,
                        {
                            withUncached: cache,
                        }
                    );
                setResult(new Some(response.data.items[0]));
            } catch (error) {
                console.error(
                    `Error fetching nft for ${collection_address}:`,
                    error
                );
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
        })();
    }, [chain_name, collection_address, token_id]);

    if (error.error) {
        return <>{error.error_message}</>;
    }

    return (
        <div className="w-full">
            {maybeResult.match({
                None: () => (
                    <div className="flex gap-2">
                        <Skeleton size={GRK_SIZES.LARGE} />{" "}
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                ),
                Some: (result) => {
                    return (
                        <Heading size={1}>
                            {result.contract_name} #
                            {result.nft_data.token_id?.toString()}{" "}
                        </Heading>
                    );
                },
            })}

            <div className="mt-4 flex gap-4">
                {maybeResult.match({
                    None: () => (
                        <div className="max-w-[30rem] rounded border ">
                            <div className="bg-accent-foreground h-[30rem] w-[30rem] animate-pulse rounded" />

                            <div className="mt-2 p-4">
                                <Heading size={4}>Attributes</Heading>

                                <div className="mt-2 flex flex-wrap gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((o, i) => {
                                        return (
                                            <Skeleton
                                                key={i}
                                                size={GRK_SIZES.LARGE}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ),
                    Some: (result) => {
                        return (
                            <div className="max-w-[30rem] rounded border border-secondary-light dark:border-secondary-dark">
                                <img
                                    className="rounded-t"
                                    src={
                                        result.nft_data.external_data.image_512
                                    }
                                />

                                <div className="mt-2 p-4">
                                    <Heading size={4}>Attributes</Heading>

                                    <div className="mt-2 flex flex-wrap gap-4">
                                        {result.nft_data.external_data?.attributes.map(
                                            (attrs, i) => {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="rounded border border-secondary-light bg-secondary-light p-2 text-primary-light dark:border-secondary-dark dark:bg-secondary-dark dark:text-primary-dark"
                                                    >
                                                        <p>
                                                            {attrs.trait_type}
                                                        </p>
                                                        <p className="text-foreground-light dark:text-foreground-dark">
                                                            {attrs.value}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    },
                })}
                <div className=" flex w-full flex-col gap-4">
                    <div className="">
                        <NFTSalesCount
                            chain_name={chain_name}
                            collection_address={collection_address}
                            token_id={token_id}
                        />
                    </div>
                    <div className="">
                        <NFTFloorPrice
                            chain_name={chain_name}
                            collection_address={collection_address}
                            token_id={token_id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
