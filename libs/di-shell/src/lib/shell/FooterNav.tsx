import React from 'react';
import { createStyles,Container, Text, Group, Anchor,ActionIcon, Footer  } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { SiteUi } from '@dotars/di-core';
import { BrandTwitter, BrandYoutube, BrandInstagram } from 'tabler-icons-react';
const useStyles = createStyles((theme) => ({
  footer: {
  
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[4]
    }`
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop:10,
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));


export const FooterNav: React.FC = () => {
  const { classes } = useStyles();


  const navigate = useNavigate();
  const onClickLink = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  const items =  SiteUi.Ctx?.footer?.links &&
  SiteUi.Ctx?.footer.links.map((link) => (
    <Anchor<'a'> color="dimmed" key={link.label}  onClick={(event) => {event.preventDefault();onClickLink(link.route)}} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    // <div className={classes.footer}>
      <Footer height={60}>
     <Container className={classes.inner}> 
      <Group><Text>Help</Text></Group>

        <Group spacing={5} position="right" noWrap>
          <ActionIcon size="lg">
            <BrandTwitter size={18} />
          </ActionIcon>
          <ActionIcon size="lg">
            <BrandYoutube size={18} />
          </ActionIcon>
          <ActionIcon size="lg">
            <BrandInstagram size={18} />
          </ActionIcon>
        </Group>
        
    </Container> 
      </Footer>
    // </div> 
  );
};
