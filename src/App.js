import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./context/session-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import { AuthenticatedApp } from "./authenticated-app";
import { UnauthenticatedApp } from "./unauthenticated-app";
import { Container, Divider, Heading, VStack, Grid } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";

function Home() {
  const { user } = useAuth();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  const queryClient = new QueryClient();
  return (
    <Grid gridTemplateRows={"100px 1fr"} height="90vh">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SessionProvider>
            <Header>VALET</Header>
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
    <Container centerContent>
      <Heading margin="5" letterSpacing="widest">
        VALET
      </Heading>
      <Divider marginBottom="5" />
    </Container>
  );
};

export default App;
