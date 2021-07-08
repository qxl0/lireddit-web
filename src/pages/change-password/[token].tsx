import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';
import NextLink from 'next/link';

const ChangePassword: NextPage<{token: string}> = ({token}) => {
    const router = useRouter();
    const [,changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('');
        return (
            <Wrapper variant="small">
        <Formik initialValues={{newPassword: ''}} 
            onSubmit={async (values, { setErrors }) => {
                const response = await changePassword({newPassword: values.newPassword, 
                    token,
                })
                console.log(response);
                if (response.data?.ChangePassword.errors){
                    const errorMap = toErrorMap(response.data.ChangePassword.errors);
                    if ('token' in errorMap){
                        setTokenError(errorMap.token);
                    }
                  setErrors(errorMap);
                } else if (response.data?.ChangePassword.user){
                  // worked
                  router.push("/");
                }
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <InputField name="newPassword" 
                        placeholder="new password" 
                        type="password"
                        label="New Password"/>
                    {tokenError? (
                        <Flex>
                        <Box color="red" mr={4}>{tokenError}</Box> 
                        <NextLink href = "/forgot-password">
                            <Link>click here to get a new one</Link>
                        </NextLink>
                        </Flex>)
                        : null}
                    <Button mt={4} type='submit' isLoading={isSubmitting} 
                        colorScheme="teal">change password</Button>
                </Form>
            )}
        </Formik>
        </Wrapper>
        );
}

ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    };
}

export default withUrqlClient(createUrqlClient)(ChangePassword);