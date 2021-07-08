import React from 'react'
import {Form, Formik} from 'formik'
import { Wrapper } from '../components/wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';
import { Box, Button } from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';


const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    return (
        <Wrapper variant="small">
        <Formik initialValues={{usernameOrEmail: "", password: ""}} 
            onSubmit={async (values, { setErrors }) => {
                const response = await login(values)
                console.log(response);
                if (response.data?.login.errors){
                  setErrors(toErrorMap(response.data.login.errors));
                } else if (response.data?.login.user){
                  // worked
                  router.push("/");
                }
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <InputField name="usernameOrEmail" placeholder="username Or Email" label="Username or Email"/>
                    <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type="password"/>
                    </Box>
                    <Button mt={4} type='submit' isLoading={isSubmitting} colorScheme="teal">login</Button>
                </Form>
            )}
        </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);