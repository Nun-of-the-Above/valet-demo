import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./context/session-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import { AuthenticatedApp } from "./authenticated-app";
import { UnauthenticatedApp } from "./unauthenticated-app";
import { Container, Divider, Heading, VStack, Grid } from "@chakra-ui/layout";
import { Image, Spinner, Box } from "@chakra-ui/react";

function Home() {
  const { user } = useAuth();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  const queryClient = new QueryClient();
  return (
    <Grid gridTemplateRows={"100px 1fr"} height="80vh">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SessionProvider>
            <Header />
            <LoadingGateAuth>
              <div className="w-full h-full">
                <Home />
              </div>
            </LoadingGateAuth>
          </SessionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Grid>
  );
}

const LoadingGateAuth = ({ children }) => {
  const { isLoadedAuth } = useAuth();

  return isLoadedAuth ? (
    <>{children}</>
  ) : (
    <VStack>
      <Spinner />
    </VStack>
  );
};

const Header = () => {
  return (
    <Container centerContent marginBottom={3}>
      <Image src="/valetlogo.png" alt="VALET" height="100%" objectFit="cover" />
      <Divider />
    </Container>
  );
};

export default App;
