import React from 'react'
import {DAppProvider, ChainId} from "@usedapp/core"
import {Header} from "./components/Header"
import {Container} from "@material-ui/core"

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Rinkeby]
    }}>
      <Header></Header>
      <Container maxWidth="md">
        <div>Hi!</div>
      </Container>
    </DAppProvider>
  )
}

export default App
