import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql";
import React from "react"
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

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
             {data!.posts.map(p => (
                <Box p={5} shadow="md" borderWidth="1px">
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
             ))}
           </Stack>
         )}
         { data? (<Flex>
          <Button 
            onClick={() => { 
              console.log("clicked: load more");
              setVariables({
              limit: variables.limit,
              cursor: data.posts[data.posts.length - 1].createdAt
            })}}
            isLoading={fetching} m="auto" my="8">Load more</Button>
         </Flex>
         ): null }
    </Layout>
    )   
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
