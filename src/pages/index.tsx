import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql";
import React from "react"
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [ variables, setVariables] = React.useState({limit:10,cursor:null as string | null});
    const [{data, fetching }] = usePostsQuery({
        variables,
    });

    console.log(variables);
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
             {data!.posts.posts.map(p => (
                <Flex p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p} />
                  <Box>
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text>posted by {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                  </Box>
                </Flex>
             ))}
           </Stack>
         )}
         { data && data.posts.hasMore? (<Flex>
          <Button 
            onClick={() => { 
              console.log("clicked: load more");
              setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
            })}}
            isLoading={fetching} m="auto" my="8">Load more</Button>
         </Flex>
         ): null }
    </Layout>
    )   
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
