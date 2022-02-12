import "./App.css";
import { SiteWrapper } from "./styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./context/session-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import { AuthenticatedApp } from "./authenticated-app";
import { UnauthenticatedApp } from "./unauthenticated-app";
import { Container, Divider, Heading } from "@chakra-ui/layout";

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
            <LoadingGateAuth>
              <div>
                <Header>VALET</Header>
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

  return isLoadedAuth ? <>{children}</> : <div>Loading the auth state...</div>;
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
