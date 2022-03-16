import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./context/session-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import { AuthenticatedApp } from "./authenticated-app";
import { UnauthenticatedApp } from "./unauthenticated-app";
import { Container, Divider, VStack } from "@chakra-ui/layout";
import { Image, Spinner } from "@chakra-ui/react";

function Home() {
  const { user } = useAuth();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  const queryClient = new QueryClient();
  return (
    <VStack>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SessionProvider>
            <Header />
            <LoadingGateAuth>
              <Home />
            </LoadingGateAuth>
          </SessionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </VStack>
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
      <Image src="/valetlogo.png" alt="VALET" height="13vh" objectFit="cover" />
      <Divider />
    </Container>
  );
};

export default App;
