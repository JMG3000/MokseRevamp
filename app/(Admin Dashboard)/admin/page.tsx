"use client";

import {
  HeaderTemplate,
  PageBuilder,
  SectionTemplate,
} from "@/components/page-builder/template";
import { Button, Card, Container, Heading, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Admin() {
  return (
    <PageBuilder>
      <HeaderTemplate imageHeight="0vh" />
      <SectionTemplate direction="column">
        <Container maxW="2xl" py={{ base: 10, md: 16 }}>
          <Card.Root>
            <Card.Header>
              <Heading size={{ base: "2xl", md: "3xl" }}>
                Admin Access Disabled
              </Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap={4}>
                <Text>
                  The prototype admin login has been disabled for production
                  hardening. Re-enable this area only after server-side
                  authentication, authorization, session management, and audit
                  logging are configured.
                </Text>
                <Button asChild width="fit-content">
                  <NextLink href="/">Return Home</NextLink>
                </Button>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Container>
      </SectionTemplate>
    </PageBuilder>
  );
}
