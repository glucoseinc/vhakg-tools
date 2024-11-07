import { Box, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const FloatingNavigationButton = ({
  linkTo,
  buttonText,
}: {
  linkTo: string;
  buttonText: string;
}) => {
  return (
    <Box m={1} float="left" position="absolute">
      <Link to={linkTo}>
        <Button width={200}>{buttonText}</Button>
      </Link>
    </Box>
  );
};
export default FloatingNavigationButton;
