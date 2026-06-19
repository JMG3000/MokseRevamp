import {
  HeaderTemplate,
  PageBuilder,
  SectionTemplate,
} from "@/components/page-builder/template";
import { getAdminDashboardData } from "@/lib/admin-dal";
import { getAdminUser } from "@/lib/admin-session";
import { Button, Card, Container, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { loginAdmin, logoutAdmin } from "./actions";

type AdminPageProps = {
  searchParams?: Promise<{ auth?: string }>;
};

const getAuthMessage = (auth: string | undefined) => {
  switch (auth) {
    case "invalid":
      return "Invalid admin credentials.";
    case "missing-config":
      return "Admin authentication is not configured.";
    case "required":
      return "Sign in to continue.";
    case "signed-out":
      return "Signed out.";
    default:
      return null;
  }
};

export default async function Admin({ searchParams }: AdminPageProps) {
  const user = await getAdminUser();
  const authMessage = getAuthMessage((await searchParams)?.auth);
  const dashboardData = user ? await getAdminDashboardData() : null;

  return (
    <PageBuilder>
      <HeaderTemplate imageHeight="0vh" />
      <SectionTemplate direction="column">
        <Container maxW="2xl" py={{ base: 10, md: 16 }}>
          <Card.Root>
            <Card.Header>
              <Heading size={{ base: "2xl", md: "3xl" }}>
                {dashboardData ? "Admin Dashboard" : "Admin Sign In"}
              </Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap={4}>
                {!dashboardData && authMessage && (
                  <Text color="orange.600">{authMessage}</Text>
                )}
                {dashboardData ? (
                  <>
                    <Text>
                      Signed in as {dashboardData.user.username}. Session issued{" "}
                      {new Date(dashboardData.user.authenticatedAt).toISOString()}.
                    </Text>
                    <Stack as="ul" gap={2} pl={4}>
                      {dashboardData.checks.map((check) => (
                        <Text as="li" key={check}>
                          {check}
                        </Text>
                      ))}
                    </Stack>
                    <form action={logoutAdmin}>
                      <Button type="submit" width="fit-content">
                        Sign Out
                      </Button>
                    </form>
                  </>
                ) : (
                  <form action={loginAdmin}>
                    <Stack gap={4}>
                      <Input
                        aria-label="Admin username"
                        autoComplete="username"
                        name="username"
                        placeholder="Admin username"
                        required
                      />
                      <Input
                        aria-label="Password"
                        autoComplete="current-password"
                        name="password"
                        placeholder="Password"
                        required
                        type="password"
                      />
                      <Button type="submit" width="fit-content">
                        Sign In
                      </Button>
                    </Stack>
                  </form>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        </Container>
      </SectionTemplate>
    </PageBuilder>
  );
}
