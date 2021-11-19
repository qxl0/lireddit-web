import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { title } from "process";
import React from "react"
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { Button } from "@chakra-ui/button";

const Index = () => {
    const [{data, fetching }] = usePostsQuery();

    if (!fetching && !data){
      return  <div>There's no data</div>
    }
    return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>
        <br></br>
        {!data && fetching ? (
         <div>loading...</div>
         ): (
           <Stack spacing={8}>
             {data!.posts.map(p => (
                <Box p={5} shadow="md" borderWidth="1px">
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
             ))}
           </Stack>
         )}
         { data? (<Flex>
          <Button isLoading={fetching} m="auto" my="8">Load more</Button>
         </Flex>
         ): null }
    </Layout>
    )   
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
