import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  SimpleGrid,
  rem,
} from "@mantine/core";
import image from "../assets/images/not-found.svg";
import BackButton from "../components/layout/BackButton";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

const NotFound = () => {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
      >
        <Image src={image} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>404 - Page Not Found</Title>
          <Text color="dimmed" size="lg">
            Page you are trying to open does not exist or you may have mistyped
            the address, or you may not have the permissions to access it.
          </Text>
          <BackButton />
        </div>
        <Image src={image} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
};

export default NotFound;
