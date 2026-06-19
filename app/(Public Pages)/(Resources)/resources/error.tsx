"use client";

import { useEffect } from "react";
import { Button, Card, Container, Heading, Stack, Text } from "@chakra-ui/react";

export default function ResourcesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Resources route failed", error);
  }, [error]);

  return (
    <Container
      aria-live="assertive"
      maxW="3xl"
      py={{ base: 10, md: 16 }}
      role="alert"
    >
      <Card.Root>
        <Card.Header>
          <Heading size={{ base: "xl", md: "2xl" }}>
            Resources are temporarily unavailable
          </Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={4}>
            <Text>
              We could not load the resource directory. Please try again in a
              moment.
            </Text>
            {error.digest && (
              <Text color="gray.500" fontSize="sm">
                Error ID: {error.digest}
              </Text>
            )}
            <Button width="fit-content" onClick={reset}>
              Retry
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
