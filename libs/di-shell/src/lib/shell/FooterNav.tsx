import { SiteUi } from '@dotars/di-core';
import { ActionIcon, Anchor, Container, Footer, Group, Text } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandInstagram, BrandTwitter, BrandYoutube } from 'tabler-icons-react';
import { shellStyles } from './ShellStyles';


export const FooterNav: React.FC = () => {
  const { classes } = shellStyles();
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
