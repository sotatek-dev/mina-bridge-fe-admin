import { Box, Button, Heading, Image, VStack } from '@chakra-ui/react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <VStack w={'full'} justifyContent={'center'} mt={'154px'}>
      <Box w={'490px'} h={'235px'}>
        <Image w={'full'} src={'/assets/images/image.empty-history.svg'} />
      </Box>
      <Heading as={'h3'} variant={'h3'} m={'35px 0'} color={'text.900'}>
        Sorry! The page you’re looking for cannot be found.
      </Heading>
      <Link href={'/'}>
        <Button w={'290px'} variant={'primary.orange.solid'}>
          Go to Homepage
        </Button>
      </Link>
    </VStack>
  );
};
export default NotFound;
