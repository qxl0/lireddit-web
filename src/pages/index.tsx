import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql";
import React from "react"
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { DeleteIcon } from "@chakra-ui/icons";

const Index = () => {
  const [ variables, setVariables] = React.useState({limit:10,cursor:null as string | null});
    const [{data, fetching }] = usePostsQuery({
        variables,
    });
  const [, deletePost] = useDeletePostMutation();

    console.log(variables);
    if (!fetching && !data){
      return  <div>There's no data</div>
    }
    return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                    </NextLink>
                  <Text>posted by {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <IconButton
                      ml="auto"
                      variantColor="red"
                      icon={<DeleteIcon />}
                      aria-label="Delete Post"
                      onClick={() => {
                        deletePost({ id: p.id });
                      }}
                    />
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
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
