 import styles from './styles.module.scss'; 
 import format from 'date-fns/format';
 import ptBR from 'date-fns/locale/pt-BR';
 import Image from 'next/image';

 
 export function Header() { // Páginas dentro de pages precisam do default. aqui desnecessário e facilita indexação na importação via VsCode.
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,

    });// biblioteca pra lidar com datas : yarn add date-fns


    return (
        <header className={styles.headerContainer}>
            <Image
                src="/logo.svg"
                alt="Podcastr"
                width={150}
                height={150}
            />

            <p>
                O melhor para você ouvir, sempre
            </p>

            <span>{currentDate}</span>

        </header> 
    );
 }