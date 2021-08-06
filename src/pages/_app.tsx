/* Arquivo global - fica em volta de todas as páginas do app - O next se encarrega - coloco aqui se quero q esteja em todas as paǵinas */
/* Tudo que está aqui é recarregado */

import '../styles/global.scss'

import { Header } from '../components/Header'
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) { // PlayerContext.Provider colocar onde deseja compartillhar dados entre componentes. createContext('') só define o padrão do dado.Ex: string vazia.
  return (
      <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
      </PlayerContextProvider>
  )
}

export default MyApp 
