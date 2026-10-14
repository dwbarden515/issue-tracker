'use client';

import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Skeleton } from "@/app/components";

interface Props {
    itemCount: number;
    pageSize: number;
    currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    if (!Number.isFinite(pageSize) || pageSize <= 0 || !Number.isFinite(itemCount) || itemCount < 0) {
        return null;
    }

    const pageCount = Math.ceil(itemCount / pageSize);
    if (pageCount <= 1) return null;

    const changePage = (page: number) => {
        const targetPage = Math.min(Math.max(Math.trunc(page), 1), pageCount);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', targetPage.toString());
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    const page = Number.isFinite(currentPage)
        ? Math.min(Math.max(Math.trunc(currentPage), 1), pageCount)
        : 1;

    return (
        <Flex align="center" gap="2" className="pt-8">
            {isPending ? (
                <>
                    <Skeleton width={90} />
                    <Skeleton width={32} height={32} />
                    <Skeleton width={32} height={32} />
                    <Skeleton width={32} height={32} />
                    <Skeleton width={32} height={32} />
                </>
            ) : (
                <>
                    <Text size="2">Page {page} of {pageCount}</Text>
                    <Button color="gray" variant="soft" disabled={page === 1} onClick={() => changePage(1)}>
                        <DoubleArrowLeftIcon />
                    </Button>
                    <Button color="gray" variant="soft" disabled={page === 1} onClick={() => changePage(page - 1)}>
                        <ChevronLeftIcon />
                    </Button>
                    <Button color="gray" variant="soft" disabled={page === pageCount} onClick={() => changePage(page + 1)}>
                        <ChevronRightIcon />
                    </Button>
                    <Button color="gray" variant="soft" disabled={page === pageCount} onClick={() => changePage(pageCount)}>
                        <DoubleArrowRightIcon />
                    </Button>
                </>
            )}
        </Flex>
    )
}

export default Pagination
