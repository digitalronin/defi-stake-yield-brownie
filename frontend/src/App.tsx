import {DAppProvider, Rinkeby} from "@usedapp/core"
import {Header} from "./components/Header"
import {Main} from "./components/Main"
import {Container} from "@material-ui/core"

function App() {
  return (
    <DAppProvider config={{
      networks: [Rinkeby],
      multicallAddresses: {
        "1337": "0x30375b532345b01cb8c2ad12541b09e9aa53a93d",
      },
    }}>
      <Header></Header>
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  )
}

export default App
