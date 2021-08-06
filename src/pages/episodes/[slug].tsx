import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import { convertDurationToTimeString } from '../../utils/ConvertDurationToTimeString';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../../services/api';
import styles from './episode.module.scss';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    membersAsString: string;
    url: string;
    publishedAt: string;
    durationAsString: string;
    description: string;
};

type EpisodeProps = {
    episode: Episode;
}
// 1) Transformar em responsivo .episodio 5
// 2) PWA - Permitir rodar online - next-pwa (útil para converter para app mobile)
// 3) Mudança de tema
// 4) Rodar no Electrum ??? .fim episodio 5.



export default function Episode({ episode } : EpisodeProps) { 
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/" passHref>
                    <button type="button">
                        <Image
                            src="/arrow-left.svg"
                            alt="Voltar"
                            width={20}
                            height={20}
                        />
                    </button>
                </Link>
                <Image 
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                    alt="Ilustração"
                />
                <button type="button" onClick={() => play(episode)}>
                    <Image
                        src="/play.svg"
                        alt="Tocar episódio"
                        width={30}
                        height={30}
                    />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{ __html: episode.description }} 
            />
        </div> 
    )
}

export const getStaticPaths : GetStaticPaths = async() => { // Toda vez que é gerada uma página estática de forma dinâmica preciso formar esse método.
    const { data } = await api.get('episodes', {
        params: {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
      })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return { // Retorna quais episódios eu quero gerar de forma estática no momento da build.
        paths, // path vazio não gera de forma estática nenhum episódio no momento da build.
        fallback: 'blocking'  //false -> se nao estiver definido nos params o slug erro 404 nao encontrado. true -> carrega quando o usuario acessa (pode gerar erro no acesso aos objetos pois faz a requisição via browser(client))
    }
} 
// Obrigatório usar em toda rota que usa getStaticProps (geração estática) - toda rota com colchetes(parâmetros dinâmicos)
// Geração estática só funciona em produção.

// True faz a requisição via Client
// False só carrega os slugs definidos no params
// Blocking - executa requisição no servidor next.js (node.js) - só é levado pra tela quando os dados ja foram carregados. Otimizado para SEO. Passar o path dos mais acessados por exemplo, o restante é gerado conforme vai se acessando.
// client(browser) - next.js(node.js) - server(back-end).
 
export const getStaticProps: GetStaticProps =  async(ctx) => {
    const { slug } = ctx.params;
    const { data }  = await api.get(`/episodes/${slug}`);
    
    const episode = {
        id: data.id, 
        title: data.title, 
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, // A cada 24 hrs gera uma página estatica com as novas informações.
    }

}