import "./App.css";
import { SiteWrapper } from "./styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider, useSessionContext } from "./context/session-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import { AuthenticatedApp } from "./authenticated-app";
import { UnauthenticatedApp } from "./unauthenticated-app";
import { Container, Divider, Heading, Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";

function Home() {
  const { user } = useAuth();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  const queryClient = new QueryClient();
  return (
    <SiteWrapper>
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
    </SiteWrapper>
  );
}

const LoadingGateAuth = ({ children }) => {
  const { isLoadedAuth } = useAuth();
  const { isLoaded } = useSessionContext();

  return isLoadedAuth && isLoaded ? (
    <>{children}</>
  ) : (
    <Center>
      <Spinner
        thickness="5px"
        speed="2s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
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
