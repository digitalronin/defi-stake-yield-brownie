import {DAppProvider, Rinkeby} from "@usedapp/core"
import {Home} from "./components/Home"
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AppAdmin} from "./components/AppAdmin"

function App() {
  return (
    <DAppProvider config={{
      networks: [Rinkeby],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      },
      multicallAddresses: {
        "1337": "0x30375b532345b01cb8c2ad12541b09e9aa53a93d",
      },
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AppAdmin />} />
        </Routes>
      </BrowserRouter>
    </DAppProvider>
  )
}

export default App
